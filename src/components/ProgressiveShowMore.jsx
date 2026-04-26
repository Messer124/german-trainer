import { useLocale } from "../contexts/LocaleContext";

export default function ProgressiveShowMore({
    hasMore,
    onShowMore,
    visibleCount,
    totalCount,
}) {
    const { locale } = useLocale();

    if (!hasMore) return null;

    return (
        <div className="show-more-row">
            <button type="button" className="show-more-button" onClick={onShowMore}>
                {locale === "en" ? "Show more" : "Показать ещё"}
            </button>
            <span className="show-more-counter">
                {visibleCount} / {totalCount}
            </span>
        </div>
    );
}
