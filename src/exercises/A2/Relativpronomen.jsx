import { useEffect, useMemo, useState } from "react";
import ModalHtml from "../../components/ModalHtml";
import ExpandingInput from "../../components/ExpandingInput";
import { usePersistentAnswers } from "../../hooks/usePersistentAnswers";

import data from "../../../data/A2/relativpronomen.json";
import slide1 from "../../../data/A2/images/relativpronomen.html?raw";
import slide2 from "../../../data/A2/images/articles.html?raw";

import "../../css/exercises/Common.css";

const STORAGE_KEY = "relativpronomen-answers";

function normalize(value) {
    return String(value ?? "")
        .trim()
        .toLowerCase()
        .replace(/\s+/g, " ");
}

function toAnswerArray(answer) {
    if (Array.isArray(answer)) return answer.map(String);
    if (typeof answer === "string") return [answer];
    return [];
}

export default function Relativpronomen() {
    const [answers, setAnswers] = usePersistentAnswers(STORAGE_KEY, {});
    const [showHint, setShowHint] = useState(false);

    const slides = useMemo(() => [slide1, slide2], []);
    const items = useMemo(() => (Array.isArray(data.items) ? data.items : []), []);

    useEffect(() => {
        const handleShowHint = () => setShowHint(true);
        document.addEventListener("show-hint", handleShowHint);
        return () => document.removeEventListener("show-hint", handleShowHint);
    }, []);

    const handleChange = (index, value) => {
        const acceptable = toAnswerArray(items[index]?.answer).map(normalize);
        const isCorrect = acceptable.includes(normalize(value));

        setAnswers((prev) => ({
            ...prev,
            [index]: { value, isCorrect },
        }));
    };

    return (
        <div className="exercise-inner">
            {showHint && (
                <ModalHtml slides={slides} initialIndex={0} onClose={() => setShowHint(false)} />
            )}

            <div className="scroll-container">
                <ul className="list">
                    {items.map((item, index) => {
                        const stored = answers[index];
                        const value = stored?.value ?? "";
                        const isCorrect = stored?.isCorrect;

                        const parts = String(item.sentence ?? "").split("___");
                        const left = parts[0] ?? "";
                        const right = parts[1] ?? "";

                        const hasValue = value.trim() !== "";
                        const inputClass = `input ${hasValue ? (isCorrect ? "correct" : "incorrect") : ""}`;

                        return (
                            <li key={index} className="list-item">
                                {left}
                                <ExpandingInput
                                    type="text"
                                    value={value}
                                    onChange={(e) => handleChange(index, e.target.value)}
                                    className={inputClass}
                                    minWidth={100}
                                    maxWidth={220}
                                    aria-label={`Relativpronomen ${index + 1}`}
                                />
                                {right}
                            </li>
                        );
                    })}
                </ul>
            </div>
        </div>
    );
}

Relativpronomen.headerButton = (
    <button
        type="button"
        className="hint-button"
        onClick={() => document.dispatchEvent(new CustomEvent("show-hint"))}
    >
        !
    </button>
);

Relativpronomen.instructions = data.instructions;
