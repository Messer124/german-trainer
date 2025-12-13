import { useEffect, useMemo, useState } from "react";
import "../css/util/modalHtml.css";
import "../../data/style/commonModal.css";

function extractBody(html) {
    if (!html) return "";

    if (typeof window !== "undefined" && typeof window.DOMParser !== "undefined") {
        try {
            const doc = new window.DOMParser().parseFromString(html, "text/html");
            const body = doc?.body?.innerHTML;
            if (typeof body === "string" && body.trim()) return body;
        } catch {
            // ignore
        }
    }

    const match = html.match(/<body[^>]*>([\s\S]*?)<\/body>/i);
    return match ? match[1] : html;
}

function clampIndex(i, len) {
    if (!Number.isFinite(i) || len <= 0) return 0;
    return Math.min(Math.max(0, i), len - 1);
}

export default function ModalHtml({ html, slides, images, initialIndex = 0, onClose }) {
    const pages = useMemo(() => {
        const rawPages = Array.isArray(slides)
            ? slides
            : Array.isArray(images)
                ? images
                : typeof html === "string"
                    ? [html]
                    : [];

        return rawPages.map((p) => extractBody(p));
    }, [html, slides, images]);

    const hasPages = pages.length > 0;
    const hasMultiple = pages.length > 1;

    const [index, setIndex] = useState(() => clampIndex(initialIndex, pages.length));
    const [isClosing, setIsClosing] = useState(false);

    const startClose = () => {
        if (isClosing) return;
        setIsClosing(true);
    };

    const goPrev = (e) => {
        e?.stopPropagation?.();
        if (!hasMultiple || isClosing) return;
        setIndex((prev) => (prev - 1 + pages.length) % pages.length);
    };

    const goNext = (e) => {
        e?.stopPropagation?.();
        if (!hasMultiple || isClosing) return;
        setIndex((prev) => (prev + 1) % pages.length);
    };

    useEffect(() => {
        if (!hasPages) return;
        setIndex(clampIndex(initialIndex, pages.length));
    }, [hasPages, pages.length, initialIndex]);

    useEffect(() => {
        const onKeyDown = (e) => {
            if (e.key === "Escape") {
                startClose();
                return;
            }
            if (!hasMultiple || isClosing) return;

            if (e.key === "ArrowLeft") {
                e.preventDefault();
                goPrev();
            } else if (e.key === "ArrowRight") {
                e.preventDefault();
                goNext();
            }
        };

        window.addEventListener("keydown", onKeyDown);
        return () => window.removeEventListener("keydown", onKeyDown);
    }, [hasMultiple, isClosing, pages.length]);

    useEffect(() => {
        if (!isClosing) return;
        const t = setTimeout(() => onClose(), 300);
        return () => clearTimeout(t);
    }, [isClosing, onClose]);

    return (
        <div
            className={`modal-overlay ${isClosing ? "modal-overlay--closing" : "modal-overlay--open"}`}
            onClick={startClose}
            role="dialog"
            aria-modal="true"
        >
            <div className="modal-html-content-wrapper" onClick={(e) => e.stopPropagation()}>
                <button
                    type="button"
                    className="modal-close-button"
                    onClick={(e) => {
                        e.stopPropagation();
                        startClose();
                    }}
                    aria-label="Close"
                    title="Close"
                >
                    ×
                </button>

                <div className="modal-html-content">
                    {hasPages ? (
                        <div className="modal-slider">
                            <div className="modal-slider__stage">
                                <div
                                    className="modal-slider__page"
                                    dangerouslySetInnerHTML={{ __html: pages[index] }}
                                />

                                {hasMultiple ? (
                                    <>
                                        <button
                                            type="button"
                                            className="modal-slider__nav modal-slider__nav--prev"
                                            onClick={goPrev}
                                            aria-label="Previous"
                                            title="Previous"
                                        >
                                            ‹
                                        </button>
                                        <button
                                            type="button"
                                            className="modal-slider__nav modal-slider__nav--next"
                                            onClick={goNext}
                                            aria-label="Next"
                                            title="Next"
                                        >
                                            ›
                                        </button>

                                        <div className="modal-slider__counter">
                                            {index + 1} / {pages.length}
                                        </div>
                                    </>
                                ) : null}
                            </div>
                        </div>
                    ) : null}
                </div>
            </div>
        </div>
    );
}