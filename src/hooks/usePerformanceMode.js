import { useEffect, useState } from "react";

const STORAGE_KEY = "runtime-performance-mode-v2";
const BENCHMARK_ITERATIONS = 320000;
const LOW_DEVICE_THRESHOLD_MS = 42;
const MAYBE_LOW_DEVICE_THRESHOLD_MS = 28;

let cachedMode = null;
let benchmarkStarted = false;

function readStoredMode() {
    if (cachedMode !== null) return cachedMode;
    if (typeof window === "undefined") return null;

    try {
        const stored = window.localStorage.getItem(STORAGE_KEY);
        if (stored === "low" || stored === "normal") {
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
    const oldIOSLike = isLikelyIOS() && cores <= 6;
    const constrainedMemory = memory !== null && memory <= 2;
    const missingModernObservers = !("IntersectionObserver" in window) || !("ResizeObserver" in window);

    return oldIOSLike || constrainedMemory || missingModernObservers;
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
