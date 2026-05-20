import { useEffect, useMemo, useRef, useState } from "react";
import ModalHtml from "../../components/ModalHtml";
import ExpandingInput from "../../components/ExpandingInput";
import ProgressiveList from "../../components/ProgressiveList";
import { useLocale } from "../../contexts/LocaleContext";
import { usePersistentAnswers } from "../../hooks/usePersistentAnswers";

import data from "../../../data/B1/passivVergangenheit.json";
import slide1Ru from "../../../data/B1/images/passivVergangenheit1.html?raw";
import slide2Ru from "../../../data/B1/images/passivVergangenheit2.html?raw";
import slide3Ru from "../../../data/B1/images/passivVergangenheit3.html?raw";
import slide4Ru from "../../../data/B1/images/passivVergangenheit4.html?raw";
import slide1En from "../../../data/B1/images/en/passivVergangenheit1.html?raw";
import slide2En from "../../../data/B1/images/en/passivVergangenheit2.html?raw";
import slide3En from "../../../data/B1/images/en/passivVergangenheit3.html?raw";
import slide4En from "../../../data/B1/images/en/passivVergangenheit4.html?raw";

import "../../css/exercises/Common.css";

const STORAGE_KEY = "b1-passiv-vergangenheit-answers";
const BLANK_PATTERN = /_{3,}/;

function normalize(value) {
    return String(value ?? "")
        .trim()
        .toLowerCase()
        .replace(/\s+/g, " ");
}

function getLocalizedText(raw, locale) {
    if (typeof raw === "string") return raw;
    if (raw && typeof raw === "object") {
        return raw[locale] ?? raw.ru ?? raw.en ?? "";
    }
    return "";
}

function getAcceptedAnswers(item) {
    const rawAnswers = Array.isArray(item?.answers)
        ? item.answers
        : Array.isArray(item?.answer)
            ? item.answer
            : [item?.answer];

    return rawAnswers
        .map((answer) => String(answer ?? "").trim())
        .filter(Boolean);
}

function normalizeSections(rawData, locale) {
    if (Array.isArray(rawData.sections)) {
        return rawData.sections
            .map((section, sectionIndex) => {
                const sectionId = section.id ?? `section-${sectionIndex}`;

                return {
                    id: sectionId,
                    label: getLocalizedText(section.label, locale),
                    items: Array.isArray(section.items)
                        ? section.items
                            .map((item, itemIndex) => ({
                                key: `${sectionId}-${itemIndex}`,
                                answerKey: `${sectionId}-${itemIndex}`,
                                sentence: getLocalizedText(item.sentence, locale),
                                placeholder: getLocalizedText(item.placeholder, locale),
                                answers: getAcceptedAnswers(item),
                            }))
                            .filter((item) => item.sentence && item.answers.length > 0)
                        : [],
                };
            })
            .filter((section) => section.label && section.items.length > 0);
    }

    const sections = [];
    let currentSection = null;

    (Array.isArray(rawData.items) ? rawData.items : []).forEach((item, rawIndex) => {
        if (!item || typeof item !== "object") return;

        const hasSentence = Object.prototype.hasOwnProperty.call(item, "sentence");
        const acceptedAnswers = getAcceptedAnswers(item);

        if (typeof item.id === "string" && !hasSentence && acceptedAnswers.length === 0) {
            currentSection = {
                id: item.id,
                label: getLocalizedText(item.label, locale),
                items: [],
            };

            sections.push(currentSection);
            return;
        }

        if (!currentSection || !hasSentence || acceptedAnswers.length === 0) return;

        const itemIndex = currentSection.items.length;

        currentSection.items.push({
            key: `${currentSection.id}-${itemIndex}`,
            answerKey: `${currentSection.id}-${itemIndex}`,
            sentence: getLocalizedText(item.sentence, locale),
            placeholder: getLocalizedText(item.placeholder, locale),
            answers: acceptedAnswers,
            rawIndex,
        });
    });

    return sections.filter((section) => section.label && section.items.length > 0);
}

export default function PassivVergangenheit() {
    const { locale } = useLocale();
    const [answers, setAnswers] = usePersistentAnswers(STORAGE_KEY, {});
    const [showHint, setShowHint] = useState(false);
    const [sectionIndex, setSectionIndex] = useState(0);
    const scrollRef = useRef(null);

    const slides = useMemo(
        () =>
            locale === "en"
                ? [slide1En, slide2En, slide3En, slide4En]
                : [slide1Ru, slide2Ru, slide3Ru, slide4Ru],
        [locale]
    );

    const sections = useMemo(() => normalizeSections(data, locale), [locale]);
    const currentSection = sections[sectionIndex];

    useEffect(() => {
        const handleShowHint = () => setShowHint(true);
        document.addEventListener("show-hint", handleShowHint);
        return () => document.removeEventListener("show-hint", handleShowHint);
    }, []);

    useEffect(() => {
        if (sectionIndex > sections.length - 1) {
            setSectionIndex(0);
        }
    }, [sectionIndex, sections.length]);

    useEffect(() => {
        scrollRef.current?.scrollTo({ top: 0 });
    }, [sectionIndex]);

    const goToPreviousSection = () => {
        setSectionIndex((current) => Math.max(0, current - 1));
    };

    const goToNextSection = () => {
        setSectionIndex((current) => Math.min(sections.length - 1, current + 1));
    };

    const handleChange = (answerKey, value, acceptedAnswers) => {
        const key = `b1-passiv-vergangenheit-${answerKey}`;
        const normalizedValue = normalize(value);
        const isCorrect = acceptedAnswers.some(
            (answer) => normalize(answer) === normalizedValue
        );

        setAnswers((prev) => ({
            ...prev,
            [key]: { value, isCorrect },
        }));
    };

    const renderInput = (row, inputMode) => {
        const key = `b1-passiv-vergangenheit-${row.answerKey}`;
        const value = answers[key]?.value ?? "";
        const isCorrect = answers[key]?.isCorrect;
        const hasValue = value.trim() !== "";
        const inputClass = hasValue
            ? isCorrect
                ? "autosize-input correct"
                : "autosize-input incorrect"
            : "autosize-input";
        const isInlineBlank = inputMode === "blank";

        return (
            <ExpandingInput
                type="text"
                className={inputClass}
                value={value}
                placeholder={row.placeholder}
                onChange={(event) =>
                    handleChange(row.answerKey, event.target.value, row.answers)
                }
                minWidth={isInlineBlank ? 95 : 300}
                mobileMinWidth={isInlineBlank ? 65 : 140}
                tabletMinWidth={isInlineBlank ? 80 : 210}
                maxWidth={isInlineBlank ? 240 : 800}
                aria-label={`Passiv Vergangenheit answer ${row.answerKey}`}
                enableHint
                hintValue={row.answers.join(" / ")}
            />
        );
    };

    const renderSentence = (row) => {
        const parts = String(row.sentence ?? "").split(BLANK_PATTERN);

        if (parts.length > 1) {
            return (
                <li key={row.key} className="list-item">
                    {parts.map((part, partIndex) => (
                        <span key={partIndex}>
                            {part}
                            {partIndex < parts.length - 1 ? renderInput(row, "blank") : null}
                        </span>
                    ))}
                </li>
            );
        }

        return (
            <li key={row.key} className="list-item">
                <span className="sentence">{row.sentence} —</span>
                {renderInput(row, "full")}
            </li>
        );
    };

    return (
        <div className="exercise-inner">
            {showHint && (
                <ModalHtml images={slides} initialIndex={0} onClose={() => setShowHint(false)} />
            )}

            <div className="scroll-container" ref={scrollRef}>
                {currentSection && (
                    <>
                        <div className="exercise-section-divider">
                            <span>{currentSection.label}</span>
                        </div>

                        <ProgressiveList
                            key={currentSection.id}
                            items={currentSection.items}
                            className="list"
                        >
                            {(row) => renderSentence(row)}
                        </ProgressiveList>
                    </>
                )}
            </div>

            {sections.length > 1 && (
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
                        {sectionIndex + 1} / {sections.length}
                    </span>

                    <button
                        type="button"
                        className="exercise-section-pager__button"
                        onClick={goToNextSection}
                        disabled={sectionIndex === sections.length - 1}
                        aria-label="Next section"
                    >
                        &gt;
                    </button>
                </div>
            )}
        </div>
    );
}

PassivVergangenheit.headerButton = (
    <button
        type="button"
        className="hint-button"
        onClick={() => document.dispatchEvent(new CustomEvent("show-hint"))}
    >
        !
    </button>
);

PassivVergangenheit.instructions = data.instructions;
PassivVergangenheit.title = data.title;
