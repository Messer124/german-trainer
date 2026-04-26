import { useEffect, useMemo, useState } from "react";
import { useIsLowPerformanceMode } from "./usePerformanceMode";

const DEFAULT_INITIAL_COUNT = 14;
const DEFAULT_STEP = 14;

export function useProgressiveItems(items, options = {}) {
    const isLowPerformance = useIsLowPerformanceMode();
    const initialCount = options.initialCount ?? DEFAULT_INITIAL_COUNT;
    const step = options.step ?? DEFAULT_STEP;
    const totalCount = Array.isArray(items) ? items.length : 0;
    const shouldLimit = isLowPerformance && totalCount > initialCount;
    const [visibleCount, setVisibleCount] = useState(initialCount);

    useEffect(() => {
        setVisibleCount(initialCount);
    }, [initialCount, shouldLimit, totalCount]);

    const visibleItems = useMemo(() => {
        if (!Array.isArray(items)) return [];
        if (!shouldLimit) return items;
        return items.slice(0, visibleCount);
    }, [items, shouldLimit, visibleCount]);

    const hasMore = shouldLimit && visibleCount < totalCount;
    const showMore = () => {
        setVisibleCount((prev) => Math.min(prev + step, totalCount));
    };

    return {
        visibleItems,
        hasMore,
        showMore,
        visibleCount: visibleItems.length,
        totalCount,
        isLimited: shouldLimit,
    };
}
