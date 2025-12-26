import { useEffect, useMemo, useState } from "react";
import { usePersistentAnswers } from "../../hooks/usePersistentAnswers";
import data from "../../../data/A1-2/prepositionsTime.json";
import hint from "../../../data/A1-2/images/prepositionsTime.html?raw";
import hint2 from "../../../data/A1-2/images/prepositionstime2.html?raw";
import "../../css/exercises/Common.css";
import ModalHtml from "../../components/ModalHtml";

function flattenItems(items) {
    if (!Array.isArray(items)) return [];
    if (Array.isArray(items[0])) return items.flat();
    return items;
}

const STORAGE_KEY = "prepositions-time-answers";

export default function PrepositionsTime() {
    const [answers, setAnswers] = usePersistentAnswers(STORAGE_KEY, {});
    const [showHint, setShowHint] = useState(false);

    const items = useMemo(() => flattenItems(data.items), [data.items]);

    useEffect(() => {
        const handleShowHint = () => setShowHint(true);
        document.addEventListener("show-hint", handleShowHint);
        return () => document.removeEventListener("show-hint", handleShowHint);
    }, []);

    const getAnswerArray = (sentenceIdx) => {
        const raw = items[sentenceIdx]?.answer;

        if (Array.isArray(raw)) {
            return raw.map((a) => String(a).trim()).filter(Boolean);
        }

        if (typeof raw === "string") {
            return raw
                .split(",")
                .map((p) => p.trim())
                .filter(Boolean);
        }

        return [];
    };

    const handleChange = (sentenceIdx, blankIdx, value) => {
        const correctAnswers = getAnswerArray(sentenceIdx).map((a) => a.toLowerCase());
        const correct = correctAnswers[blankIdx] ?? "";
        const key = `${sentenceIdx}-${blankIdx}`;

        setAnswers((prev) => ({
            ...prev,
            [key]: {
                value,
                isCorrect: value.trim().toLowerCase() === correct,
            },
        }));
    };

    const renderSentence = (item, sentenceIdx) => {
        const parts = String(item.sentence || "").split("___");
        const answerArray = getAnswerArray(sentenceIdx);

        return (
            <li key={sentenceIdx}>
                {parts.map((part, idx) => {
                    const key = `${sentenceIdx}-${idx}`;
                    const inputValue = answers[key]?.value || "";
                    const isCorrect = answers[key]?.isCorrect;

                    let inputClass = "input";
                    if (inputValue.trim() !== "") {
                        inputClass += isCorrect ? " correct" : " incorrect";
                    }

                    return (
                        <span key={idx}>
              {part}
                            {idx < answerArray.length && (
                                <input
                                    type="text"
                                    value={inputValue}
                                    onChange={(e) => handleChange(sentenceIdx, idx, e.target.value)}
                                    className={inputClass}
                                    autoComplete="off"
                                    spellCheck={false}
                                />
                            )}
            </span>
                    );
                })}
            </li>
        );
    };

    return (
        <div className="exercise-inner">
            {showHint && (
                <ModalHtml
                    slides={[hint, hint2]}
                    initialIndex={0}
                    onClose={() => setShowHint(false)}
                />
            )}

            <div className="scroll-container">
                <ul className="list">{data.items.map((item, idx) => renderSentence(item, idx))}</ul>
            </div>
        </div>
    );
}

PrepositionsTime.headerButton = (
    <button
        type="button"
        className="hint-button"
        onClick={() => document.dispatchEvent(new CustomEvent("show-hint"))}
    >
        !
    </button>
);

PrepositionsTime.instructions = data.instructions;
PrepositionsTime.title = data.title;

