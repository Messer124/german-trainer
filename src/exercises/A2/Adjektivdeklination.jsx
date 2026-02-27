import { useEffect, useMemo, useState } from "react";
import ModalHtml from "../../components/ModalHtml";
import ExpandingInput from "../../components/ExpandingInput";
import { useLocale } from "../../contexts/LocaleContext";
import { usePersistentAnswers } from "../../hooks/usePersistentAnswers";

import data from "../../../data/A2/adjektivdeklination.json";
import slide1Ru from "../../../data/A2/images/adjektivdeklination1.html?raw";
import slide2Ru from "../../../data/A2/images/adjektivdeklination2.html?raw";
import slide3Ru from "../../../data/A2/images/adjektivdeklination3.html?raw";
import slide1En from "../../../data/A2/images/en/adjektivdeklination1.html?raw";
import slide2En from "../../../data/A2/images/en/adjektivdeklination2.html?raw";
import slide3En from "../../../data/A2/images/en/adjektivdeklination3.html?raw";

import "../../css/exercises/Common.css";

const STORAGE_KEY = "adjektivdeklination-answers";

function normalize(value) {
    return String(value ?? "")
        .trim()
        .toLowerCase()
        .replace(/\s+/g, " ");
}

function getSentenceText(rawSentence, locale) {
    if (typeof rawSentence === "string") return rawSentence;
    if (rawSentence && typeof rawSentence === "object") {
        return rawSentence[locale] ?? rawSentence.ru ?? rawSentence.en ?? "";
    }
    return "";
}

function getAnswerArray(item) {
    if (Array.isArray(item?.answers)) return item.answers.map(String);
    if (Array.isArray(item?.answer)) return item.answer.map(String);
    return [];
}

export default function Adjektivdeklination() {
    const { locale } = useLocale();
    const [answers, setAnswers] = usePersistentAnswers(STORAGE_KEY, {});
    const [showHint, setShowHint] = useState(false);

    const slides = useMemo(
        () => (locale === "en" ? [slide1En, slide2En, slide3En] : [slide1Ru, slide2Ru, slide3Ru]),
        [locale]
    );
    const items = useMemo(() => (Array.isArray(data.items) ? data.items : []), []);

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

            <div className="scroll-container">
                <ul className="list">
                    {items.map((item, sentenceIdx) => {
                        const sentence = getSentenceText(item.sentence, locale);
                        const answerArray = getAnswerArray(item);
                        const parts = sentence.split(/_{3,}/);

                        return (
                            <li key={sentenceIdx} className="list-item">
                                {parts.map((part, idx) => {
                                    const key = `${sentenceIdx}-${idx}`;
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
                                                            sentenceIdx,
                                                            idx,
                                                            e.target.value,
                                                            answerArray[idx]
                                                        )
                                                    }
                                                    className={inputClass}
                                                    minWidth={70}
                                                    maxWidth={260}
                                                    aria-label={`Adjektivdeklination blank ${idx + 1} (sentence ${sentenceIdx + 1})`}
                                                />
                                            ) : null}
                                        </span>
                                    );
                                })}
                            </li>
                        );
                    })}
                </ul>
            </div>
        </div>
    );
}

Adjektivdeklination.headerButton = (
    <button
        type="button"
        className="hint-button"
        onClick={() => document.dispatchEvent(new CustomEvent("show-hint"))}
    >
        !
    </button>
);

Adjektivdeklination.instructions = data.instructions;
Adjektivdeklination.title = data.title;
