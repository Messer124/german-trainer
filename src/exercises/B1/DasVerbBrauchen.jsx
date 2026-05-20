import { useEffect, useMemo, useState } from "react";
import ModalHtml from "../../components/ModalHtml";
import ExpandingInput from "../../components/ExpandingInput";
import SectionedProgressiveList from "../../components/SectionedProgressiveList";
import { useLocale } from "../../contexts/LocaleContext";
import { usePersistentAnswers } from "../../hooks/usePersistentAnswers";
import { normalizeExerciseSections } from "../../utils/sectionedExercise";

import data from "../../../data/B1/dasVerbBrauchen.json";
import slideRu from "../../../data/B1/images/dasVerbBrauchen.html?raw";
import slideEn from "../../../data/B1/images/en/dasVerbBrauchen.html?raw";

import "../../css/exercises/Common.css";

const STORAGE_KEY = "das-verb-brauchen-answers";

function normalize(value) {
    return String(value ?? "")
        .trim()
        .toLowerCase()
        .replace(/\s+/g, " ");
}

export default function DasVerbBrauchen() {
    const { locale } = useLocale();
    const [answers, setAnswers] = usePersistentAnswers(STORAGE_KEY, {});
    const [showHint, setShowHint] = useState(false);

    const slides = useMemo(
        () => (locale === "en" ? [slideEn] : [slideRu]),
        [locale]
    );

    const sections = useMemo(
        () => normalizeExerciseSections(data, locale, "das-verb-brauchen"),
        [locale]
    );

    useEffect(() => {
        const handleShowHint = () => setShowHint(true);
        document.addEventListener("show-hint", handleShowHint);
        return () => document.removeEventListener("show-hint", handleShowHint);
    }, []);

    const handleChange = (answerKey, value, acceptedAnswers) => {
        const key = `das-verb-brauchen-${answerKey}`;
        const normalizedValue = normalize(value);
        const isCorrect = acceptedAnswers.some(
            (answer) => normalize(answer) === normalizedValue
        );

        setAnswers((prev) => ({
            ...prev,
            [key]: { value, isCorrect },
        }));
    };

    const renderInput = (row) => {
        const key = `das-verb-brauchen-${row.answerKey}`;
        const value = answers[key]?.value ?? "";
        const isCorrect = answers[key]?.isCorrect;
        const hasValue = value.trim() !== "";
        const inputClass = hasValue
            ? isCorrect
                ? "autosize-input correct"
                : "autosize-input incorrect"
            : "autosize-input";

        return (
            <ExpandingInput
                type="text"
                className={inputClass}
                value={value}
                placeholder={row.placeholder}
                onChange={(event) =>
                    handleChange(row.answerKey, event.target.value, row.answers)
                }
                minWidth={300}
                mobileMinWidth={140}
                tabletMinWidth={210}
                maxWidth={820}
                aria-label={`Das Verb brauchen answer ${row.answerKey}`}
                enableHint
                hintValue={row.answers.join(" / ")}
            />
        );
    };

    return (
        <div className="exercise-inner">
            {showHint && (
                <ModalHtml images={slides} initialIndex={0} onClose={() => setShowHint(false)} />
            )}

            <SectionedProgressiveList sections={sections} className="list">
                {(row) => (
                    <li key={row.key} className="list-item">
                        <span className="sentence">{row.sentence} —</span>
                        {renderInput(row)}
                    </li>
                )}
            </SectionedProgressiveList>
        </div>
    );
}

DasVerbBrauchen.headerButton = (
    <button
        type="button"
        className="hint-button"
        onClick={() => document.dispatchEvent(new CustomEvent("show-hint"))}
    >
        !
    </button>
);

DasVerbBrauchen.instructions = data.instructions;
DasVerbBrauchen.title = data.title;
