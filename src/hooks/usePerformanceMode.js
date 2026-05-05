import { useEffect, useState } from "react";

const STORAGE_KEY = "runtime-performance-mode-v3";
const OVERRIDE_STORAGE_KEY = "runtime-performance-mode-override";
const BENCHMARK_ITERATIONS = 320000;
const LOW_DEVICE_THRESHOLD_MS = 42;
const MAYBE_LOW_DEVICE_THRESHOLD_MS = 28;

let cachedMode = null;
let benchmarkStarted = false;

function readStoredMode() {
    if (cachedMode !== null) return cachedMode;
    if (typeof window === "undefined") return null;

    try {
        const override = window.localStorage.getItem(OVERRIDE_STORAGE_KEY);
        if (override === "low" || override === "normal") {
            cachedMode = override;
            return override;
        }

        const stored = window.localStorage.getItem(STORAGE_KEY);
        const likelyLow = isLikelyLowPowerFromEnvironment();

        if (stored === "low" || (stored === "normal" && !likelyLow)) {
            cachedMode = stored;
            return stored;
        }
    } catch {
        return null;
    }

    return null;
}

function storeMode(mode) {
    cachedMode = mode;

    if (typeof window === "undefined") return;

    try {
        window.localStorage.setItem(STORAGE_KEY, mode);
    } catch {
        // Performance mode is an optimization only, so storage failures are harmless.
    }
}

function isLikelyIOS() {
    if (typeof navigator === "undefined") return false;

    return (
        /iPad|iPhone|iPod/i.test(navigator.userAgent) ||
        (navigator.platform === "MacIntel" && navigator.maxTouchPoints > 1)
    );
}

function isLikelyLowPowerFromEnvironment() {
    if (typeof window === "undefined" || typeof navigator === "undefined") {
        return false;
    }

    const cores = navigator.hardwareConcurrency || 2;
    const memory = navigator.deviceMemory || null;
    const touchPoints = navigator.maxTouchPoints || 0;
    const coarsePointer = window.matchMedia?.("(pointer: coarse)")?.matches ?? false;
    const tabletViewport = window.matchMedia?.("(min-width: 600px) and (max-width: 1200px)")?.matches ?? false;
    const oldIOSLike = isLikelyIOS() && cores <= 6;
    const touchTablet = (touchPoints > 1 || coarsePointer) && tabletViewport;
    const constrainedMemory = memory !== null && memory <= 2;
    const missingModernObservers = !("IntersectionObserver" in window) || !("ResizeObserver" in window);

    return oldIOSLike || touchTablet || constrainedMemory || missingModernObservers;
}

function measureRuntimeCost() {
    const start = performance.now();
    let value = 0;

    for (let i = 0; i < BENCHMARK_ITERATIONS; i += 1) {
        value += Math.sqrt(i) % 7;
    }

    if (value < 0) {
        console.debug(value);
    }

    return performance.now() - start;
}

function detectMode() {
    const likelyLow = isLikelyLowPowerFromEnvironment();

    if (typeof performance === "undefined") {
        return likelyLow ? "low" : "normal";
    }

    const duration = measureRuntimeCost();
    const isLow =
        duration >= LOW_DEVICE_THRESHOLD_MS ||
        (likelyLow && duration >= MAYBE_LOW_DEVICE_THRESHOLD_MS);

    return isLow ? "low" : "normal";
}

export function usePerformanceMode() {
    const [mode, setMode] = useState(() => {
        const stored = readStoredMode();
        if (stored) return stored;
        return isLikelyLowPowerFromEnvironment() ? "low" : "normal";
    });

    useEffect(() => {
        const stored = readStoredMode();
        if (stored || benchmarkStarted || typeof window === "undefined") {
            return undefined;
        }

        benchmarkStarted = true;
        const timer = window.setTimeout(() => {
            const detectedMode = detectMode();
            storeMode(detectedMode);
            setMode(detectedMode);
            window.dispatchEvent(
                new CustomEvent("runtime-performance-mode-change", {
                    detail: { mode: detectedMode },
                })
            );
        }, 120);

        return () => window.clearTimeout(timer);
    }, []);

    useEffect(() => {
        if (typeof window === "undefined") return undefined;

        const handleModeChange = (event) => {
            const nextMode = event.detail?.mode;
            if (nextMode === "low" || nextMode === "normal") {
                setMode(nextMode);
            }
        };

        window.addEventListener("runtime-performance-mode-change", handleModeChange);
        return () => {
            window.removeEventListener("runtime-performance-mode-change", handleModeChange);
        };
    }, []);

    return mode;
}

export function useIsLowPerformanceMode() {
    return usePerformanceMode() === "low";
}
