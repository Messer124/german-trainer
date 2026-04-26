import { useProgressiveItems } from "../hooks/useProgressiveItems";
import ProgressiveShowMore from "./ProgressiveShowMore";

export default function ProgressiveList({
    items,
    children,
    className,
    as: Component = "ul",
    initialCount,
    step,
}) {
    const {
        visibleItems,
        hasMore,
        showMore,
        visibleCount,
        totalCount,
    } = useProgressiveItems(items, { initialCount, step });

    return (
        <>
            <Component className={className}>
                {visibleItems.map((item, index) => children(item, index))}
            </Component>
            <ProgressiveShowMore
                hasMore={hasMore}
                onShowMore={showMore}
                visibleCount={visibleCount}
                totalCount={totalCount}
            />
        </>
    );
}
