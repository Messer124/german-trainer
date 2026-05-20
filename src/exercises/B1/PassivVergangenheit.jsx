import { useEffect, useMemo, useState } from "react";
import ModalHtml from "../../components/ModalHtml";
import ExpandingInput from "../../components/ExpandingInput";
import SectionedProgressiveList from "../../components/SectionedProgressiveList";
import { useLocale } from "../../contexts/LocaleContext";
import { usePersistentAnswers } from "../../hooks/usePersistentAnswers";
import { normalizeExerciseSections } from "../../utils/sectionedExercise";

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

export default function PassivVergangenheit() {
    const { locale } = useLocale();
    const [answers, setAnswers] = usePersistentAnswers(STORAGE_KEY, {});
    const [showHint, setShowHint] = useState(false);

    const slides = useMemo(
        () =>
            locale === "en"
                ? [slide1En, slide2En, slide3En, slide4En]
                : [slide1Ru, slide2Ru, slide3Ru, slide4Ru],
        [locale]
    );

    const sections = useMemo(
        () => normalizeExerciseSections(data, locale, "b1-passiv-vergangenheit"),
        [locale]
    );

    useEffect(() => {
        const handleShowHint = () => setShowHint(true);
        document.addEventListener("show-hint", handleShowHint);
        return () => document.removeEventListener("show-hint", handleShowHint);
    }, []);

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

            <SectionedProgressiveList sections={sections} className="list">
                {(row) => renderSentence(row)}
            </SectionedProgressiveList>
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
