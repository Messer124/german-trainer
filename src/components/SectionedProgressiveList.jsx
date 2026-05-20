import { useEffect, useRef, useState } from "react";
import ProgressiveList from "./ProgressiveList";

export function rowsToSections(rows, fallbackId = "section") {
    const sections = [];
    let currentSection = null;

    (Array.isArray(rows) ? rows : []).forEach((row, index) => {
        if (row?.type === "divider") {
            currentSection = {
                id: row.id ?? `${fallbackId}-${sections.length}`,
                key: row.key ?? `${fallbackId}-divider-${index}`,
                label: row.label,
                items: [],
            };
            sections.push(currentSection);
            return;
        }

        if (!currentSection) {
            currentSection = {
                id: `${fallbackId}-default`,
                key: `${fallbackId}-default`,
                label: "",
                items: [],
            };
            sections.push(currentSection);
        }

        currentSection.items.push(row);
    });

    return sections.filter((section) => section.items.length > 0);
}

export default function SectionedProgressiveList({
    sections,
    children,
    className = "list",
    renderLabel,
}) {
    const [sectionIndex, setSectionIndex] = useState(0);
    const scrollRef = useRef(null);
    const safeSections = Array.isArray(sections) ? sections : [];
    const currentSection = safeSections[sectionIndex];

    useEffect(() => {
        if (sectionIndex > safeSections.length - 1) {
            setSectionIndex(0);
        }
    }, [sectionIndex, safeSections.length]);

    useEffect(() => {
        scrollRef.current?.scrollTo({ top: 0 });
    }, [sectionIndex]);

    const goToPreviousSection = () => {
        setSectionIndex((current) => Math.max(0, current - 1));
    };

    const goToNextSection = () => {
        setSectionIndex((current) => Math.min(safeSections.length - 1, current + 1));
    };

    return (
        <>
            <div className="scroll-container" ref={scrollRef}>
                {currentSection && (
                    <>
                        {currentSection.label ? (
                            <div className="exercise-section-divider">
                                <span>
                                    {renderLabel
                                        ? renderLabel(currentSection.label, currentSection)
                                        : currentSection.label}
                                </span>
                            </div>
                        ) : null}

                        <ProgressiveList
                            key={currentSection.id}
                            items={currentSection.items}
                            className={className}
                        >
                            {children}
                        </ProgressiveList>
                    </>
                )}
            </div>

            {safeSections.length > 1 && (
                <div className="exercise-section-pager">
                    <button
                        type="button"
                        className="exercise-section-pager__button"
                        onClick={goToPreviousSection}
                        disabled={sectionIndex === 0}
                        aria-label="Previous section"
                    >
                        &lt;
                    </button>

                    <span className="exercise-section-pager__status">
                        {sectionIndex + 1} / {safeSections.length}
                    </span>

                    <button
                        type="button"
                        className="exercise-section-pager__button"
                        onClick={goToNextSection}
                        disabled={sectionIndex === safeSections.length - 1}
                        aria-label="Next section"
                    >
                        &gt;
                    </button>
                </div>
            )}
        </>
    );
}
