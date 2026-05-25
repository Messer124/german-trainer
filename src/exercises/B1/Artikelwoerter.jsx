import { useEffect, useMemo, useState } from "react";
import ModalHtml from "../../components/ModalHtml";
import ExpandingInput from "../../components/ExpandingInput";
import ProgressiveList from "../../components/ProgressiveList";
import { useLocale } from "../../contexts/LocaleContext";
import { usePersistentAnswers } from "../../hooks/usePersistentAnswers";

import data from "../../../data/B1/artikelwoerter.json";
import slideRu from "../../../data/B1/images/artikelwoerter.html?raw";
import slideEn from "../../../data/B1/images/en/artikelwoerter.html?raw";

import "../../css/exercises/Common.css";

const STORAGE_KEY = "artikelwoerter-answers";

function normalize(value) {
    return String(value ?? "")
        .trim()
        .toLowerCase()
        .replace(/\s+/g, " ");
}

export default function Artikelwoerter() {
    const { locale } = useLocale();
    const [answers, setAnswers] = usePersistentAnswers(STORAGE_KEY, {});
    const [showHint, setShowHint] = useState(false);

    const slides = useMemo(
        () => (locale === "en" ? [slideEn] : [slideRu]),
        [locale]
    );

    const items = useMemo(
        () =>
            (Array.isArray(data.items) ? data.items : []).map((item, itemIndex) => ({
                ...item,
                key: `artikelwoerter-${itemIndex}`,
                sentenceIndex: itemIndex,
                answers: Array.isArray(item.answers) ? item.answers : [],
            })),
        []
    );

    useEffect(() => {
        const handleShowHint = () => setShowHint(true);
        document.addEventListener("show-hint", handleShowHint);
        return () => document.removeEventListener("show-hint", handleShowHint);
    }, []);

    const handleChange = (sentenceIndex, blankIndex, value, correctAnswer) => {
        const key = `${sentenceIndex}-${blankIndex}`;
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
                <ProgressiveList items={items} className="list">
                    {(row) => {
                        const parts = row.sentence.split(/_{3,}/);

                        return (
                            <li key={row.key} className="list-item">
                                {parts.map((part, idx) => {
                                    const key = `${row.sentenceIndex}-${idx}`;
                                    const value = answers[key]?.value ?? "";
                                    const isCorrect = answers[key]?.isCorrect;
                                    const correctAnswer = row.answers[idx];

                                    let inputClass = "input";
                                    if (value.trim() !== "") {
                                        inputClass += isCorrect ? " correct" : " incorrect";
                                    }

                                    return (
                                        <span key={idx}>
                                            {part}
                                            {idx < row.answers.length ? (
                                                <ExpandingInput
                                                    type="text"
                                                    value={value}
                                                    onChange={(e) =>
                                                        handleChange(
                                                            row.sentenceIndex,
                                                            idx,
                                                            e.target.value,
                                                            correctAnswer
                                                        )
                                                    }
                                                    className={inputClass}
                                                    enableHint
                                                    delayedHint
                                                    hintValue={correctAnswer}
                                                    minWidth={80}
                                                    mobileMinWidth={35}
                                                    tabletMinWidth={40}
                                                    maxWidth={100}
                                                    aria-label={`Artikelwörter blank ${idx + 1} (sentence ${row.sentenceIndex + 1})`}
                                                />
                                            ) : null}
                                        </span>
                                    );
                                })}
                            </li>
                        );
                    }}
                </ProgressiveList>
            </div>
        </div>
    );
}

Artikelwoerter.headerButton = (
    <button
        type="button"
        className="hint-button"
        onClick={() => document.dispatchEvent(new CustomEvent("show-hint"))}
    >
        !
    </button>
);

Artikelwoerter.instructions = data.instructions;
Artikelwoerter.title = data.title;
