import { useEffect, useMemo, useState } from "react";
import ModalHtml from "../../components/ModalHtml";
import ExpandingInput from "../../components/ExpandingInput";
import SectionedProgressiveList from "../../components/SectionedProgressiveList";
import { useLocale } from "../../contexts/LocaleContext";
import { usePersistentAnswers } from "../../hooks/usePersistentAnswers";
import { normalizeExerciseSections } from "../../utils/sectionedExercise";

import data from "../../../data/A2/dasVerbLassen.json";
import slide1Ru from "../../../data/A2/images/dasVerbLassen1.html?raw";
import slide2Ru from "../../../data/A2/images/dasVerbLassen2.html?raw";
import slide3Ru from "../../../data/A2/images/dasVerbLassen3.html?raw";
import slide1En from "../../../data/A2/images/en/dasVerbLassen1.html?raw";
import slide2En from "../../../data/A2/images/en/dasVerbLassen2.html?raw";
import slide3En from "../../../data/A2/images/en/dasVerbLassen3.html?raw";

import "../../css/exercises/Common.css";

const STORAGE_KEY = "das-verb-lassen-answers";

function normalize(value) {
    return String(value ?? "")
        .trim()
        .toLowerCase()
        .replace(/\s+/g, " ");
}

export default function DasVerbLassen() {
    const { locale } = useLocale();
    const [answers, setAnswers] = usePersistentAnswers(STORAGE_KEY, {});
    const [showHint, setShowHint] = useState(false);

    const slides = useMemo(
        () => (locale === "en" ? [slide1En, slide2En, slide3En] : [slide1Ru, slide2Ru, slide3Ru]),
        [locale]
    );
    const sections = useMemo(
        () => normalizeExerciseSections(data, locale, "das-verb-lassen"),
        [locale]
    );

    useEffect(() => {
        const handleShowHint = () => setShowHint(true);
        document.addEventListener("show-hint", handleShowHint);
        return () => document.removeEventListener("show-hint", handleShowHint);
    }, []);

    const handleChange = (sentenceIndex, value, correctAnswer) => {
        const key = `das-verb-lassen-${sentenceIndex}`;
        const isCorrect = normalize(value) === normalize(correctAnswer);

        setAnswers((prev) => ({
            ...prev,
            [key]: { value, isCorrect },
        }));
    };

    return (
        <div className="exercise-inner">
            {showHint && (
                <ModalHtml images={slides} initialIndex={0} onClose={() => setShowHint(false)} />
            )}

            <SectionedProgressiveList sections={sections} className="list">
                    {(row) => {
                        const key = `das-verb-lassen-${row.sentenceIndex}`;
                        const value = answers[key]?.value ?? "";
                        const isCorrect = answers[key]?.isCorrect;
                        const hasValue = value.trim() !== "";
                        const inputClass = hasValue
                            ? isCorrect
                                ? "autosize-input correct"
                                : "autosize-input incorrect"
                            : "autosize-input";

                        return (
                            <li key={row.key}>
                                <span className="sentence">{row.sentence} —</span>
                                <ExpandingInput
                                    type="text"
                                    className={inputClass}
                                    value={value}
                                    onChange={(event) =>
                                        handleChange(row.sentenceIndex, event.target.value, row.answer)
                                    }
                                    minWidth={220}
                                    tabletMinWidth={170}
                                    mobileMinWidth={110}
                                    maxWidth={860}
                                    aria-label={`Das Verb lassen answer ${row.sentenceIndex + 1}`}
                                    enableHint={true}
                                    hintValue={row.answer}
                                />
                            </li>
                        );
                    }}
            </SectionedProgressiveList>
        </div>
    );
}

DasVerbLassen.headerButton = (
    <button
        type="button"
        className="hint-button"
        onClick={() => document.dispatchEvent(new CustomEvent("show-hint"))}
    >
        !
    </button>
);

DasVerbLassen.instructions = data.instructions;
DasVerbLassen.title = data.title;
