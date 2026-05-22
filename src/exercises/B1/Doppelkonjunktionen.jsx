import { useEffect, useMemo, useState } from "react";
import ModalHtml from "../../components/ModalHtml";
import ExpandingInput from "../../components/ExpandingInput";
import SectionedProgressiveList from "../../components/SectionedProgressiveList";
import { useLocale } from "../../contexts/LocaleContext";
import { usePersistentAnswers } from "../../hooks/usePersistentAnswers";
import { normalizeExerciseSections } from "../../utils/sectionedExercise";

import data from "../../../data/B1/doppelkonjunktionen.json";
import slideRu from "../../../data/B1/images/doppelkonjunktionen.html?raw";
import slideEn from "../../../data/B1/images/en/doppelkonjunktionen.html?raw";

import "../../css/exercises/Common.css";

const STORAGE_KEY = "doppelkonjunktionen-answers";

function normalize(value) {
    return String(value ?? "")
        .trim()
        .toLowerCase()
        .replace(/[.!?]+$/u, "")
        .replace(/\s+/g, " ");
}

export default function Doppelkonjunktionen() {
    const { locale } = useLocale();
    const [answers, setAnswers] = usePersistentAnswers(STORAGE_KEY, {});
    const [showHint, setShowHint] = useState(false);

    const slides = useMemo(
        () => (locale === "en" ? [slideEn] : [slideRu]),
        [locale]
    );

    const sections = useMemo(
        () => normalizeExerciseSections(data, locale, "doppelkonjunktionen"),
        [locale]
    );

    useEffect(() => {
        const handleShowHint = () => setShowHint(true);
        document.addEventListener("show-hint", handleShowHint);
        return () => document.removeEventListener("show-hint", handleShowHint);
    }, []);

    const handleChange = (answerKey, value, acceptedAnswers) => {
        const key = `doppelkonjunktionen-${answerKey}`;
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
        const key = `doppelkonjunktionen-${row.answerKey}`;
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
                minWidth={360}
                mobileMinWidth={150}
                tabletMinWidth={240}
                maxWidth={920}
                aria-label={`Doppelkonjunktionen answer ${row.answerKey}`}
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

Doppelkonjunktionen.headerButton = (
    <button
        type="button"
        className="hint-button"
        onClick={() => document.dispatchEvent(new CustomEvent("show-hint"))}
    >
        !
    </button>
);

Doppelkonjunktionen.instructions = data.instructions;
Doppelkonjunktionen.title = data.title;
