import { useEffect, useMemo, useState } from "react";
import ModalHtml from "../../components/ModalHtml";
import ExpandingInput from "../../components/ExpandingInput";
import SectionedProgressiveList from "../../components/SectionedProgressiveList";
import { useLocale } from "../../contexts/LocaleContext";
import { usePersistentAnswers } from "../../hooks/usePersistentAnswers";
import { normalizeExerciseSections } from "../../utils/sectionedExercise";

import data from "../../../data/B1/steigerungVonAdjektiven.json";
import slide1Ru from "../../../data/B1/images/steigerungVonAdjektiven1.html?raw";
import slide2Ru from "../../../data/B1/images/steigerungVonAdjektiven2.html?raw";
import slide3Ru from "../../../data/B1/images/steigerungVonAdjektiven3.html?raw";
import slide4Ru from "../../../data/B1/images/steigerungVonAdjektiven4.html?raw";
import slide1En from "../../../data/B1/images/en/steigerungVonAdjektiven1.html?raw";
import slide2En from "../../../data/B1/images/en/steigerungVonAdjektiven2.html?raw";
import slide3En from "../../../data/B1/images/en/steigerungVonAdjektiven3.html?raw";
import slide4En from "../../../data/B1/images/en/steigerungVonAdjektiven4.html?raw";

import "../../css/exercises/Common.css";

const STORAGE_KEY = "steigerung-von-adjektiven-answers";

function normalize(value) {
    return String(value ?? "")
        .trim()
        .toLowerCase()
        .replace(/\s+/g, " ");
}

export default function SteigerungVonAdjektiven() {
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
        () => normalizeExerciseSections(data, locale, "steigerung-von-adjektiven"),
        [locale]
    );

    useEffect(() => {
        const handleShowHint = () => setShowHint(true);
        document.addEventListener("show-hint", handleShowHint);
        return () => document.removeEventListener("show-hint", handleShowHint);
    }, []);

    const handleChange = (sentenceIdx, blankIdx, value, correctAnswer) => {
        const key = `${sentenceIdx}-${blankIdx}`;
        const isCorrect = normalize(value) === normalize(correctAnswer);

        setAnswers((prev) => ({
            ...prev,
            [key]: {
                value,
                isCorrect,
            },
        }));
    };

    return (
        <div className="exercise-inner">
            {showHint && (
                <ModalHtml images={slides} initialIndex={0} onClose={() => setShowHint(false)} />
            )}

            <SectionedProgressiveList sections={sections} className="list">
                    {(row) => {
                        const sentence = row.sentence;
                        const answerArray = row.answers;
                        const parts = sentence.split(/_{3,}/);

                        return (
                            <li key={row.key} className="list-item">
                                {parts.map((part, idx) => {
                                    const key = `${row.sentenceIndex}-${idx}`;
                                    const value = answers[key]?.value ?? "";
                                    const isCorrect = answers[key]?.isCorrect;

                                    let inputClass = "input";
                                    if (value.trim() !== "") {
                                        inputClass += isCorrect ? " correct" : " incorrect";
                                    }

                                    return (
                                        <span key={idx}>
                                            {part}
                                            {idx < answerArray.length ? (
                                                <ExpandingInput
                                                    type="text"
                                                    value={value}
                                                    onChange={(e) =>
                                                        handleChange(
                                                            row.sentenceIndex,
                                                            idx,
                                                            e.target.value,
                                                            answerArray[idx]
                                                        )
                                                    }
                                                    className={inputClass}
                                                    enableHint
                                                    delayedHint
                                                    hintValue={answerArray[idx]}
                                                    minWidth={80}
                                                    mobileMinWidth={35}
                                                    tabletMinWidth={40}
                                                    maxWidth={100}
                                                    aria-label={`Steigerung von Adjektiven blank ${idx + 1} (sentence ${row.sentenceIndex + 1})`}
                                                />
                                            ) : null}
                                        </span>
                                    );
                                })}
                            </li>
                        );
                    }}
            </SectionedProgressiveList>
        </div>
    );
}

SteigerungVonAdjektiven.headerButton = (
    <button
        type="button"
        className="hint-button"
        onClick={() => document.dispatchEvent(new CustomEvent("show-hint"))}
    >
        !
    </button>
);

SteigerungVonAdjektiven.instructions = data.instructions;
SteigerungVonAdjektiven.title = data.title;
