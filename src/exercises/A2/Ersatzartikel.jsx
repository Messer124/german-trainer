import { useEffect, useMemo, useState } from "react";
import ModalHtml from "../../components/ModalHtml";
import ExpandingInput from "../../components/ExpandingInput";
import { useLocale } from "../../contexts/LocaleContext";
import { usePersistentAnswers } from "../../hooks/usePersistentAnswers";

import data from "../../../data/A2/ersatzartikel.json";
import hintRu from "../../../data/A2/images/ersatzartikel.html?raw";
import hintEn from "../../../data/A2/images/en/ersatzartikel.html?raw";

import "../../css/exercises/Common.css";

const STORAGE_KEY = "ersatzartikel-answers";

function normalizeItems(rawItems) {
    if (Array.isArray(rawItems) && rawItems.length > 0 && Array.isArray(rawItems[0])) {
        return rawItems.flat();
    }
    return Array.isArray(rawItems) ? rawItems : [];
}

function normalize(value) {
    return String(value ?? "")
        .trim()
        .toLowerCase()
        .replace(/\s+/g, " ");
}

export default function Ersatzartikel() {
    const { locale } = useLocale();
    const [answers, setAnswers] = usePersistentAnswers(STORAGE_KEY, {});
    const [showHint, setShowHint] = useState(false);
    const hint = locale === "en" ? hintEn : hintRu;

    const items = useMemo(() => normalizeItems(data.items), []);

    useEffect(() => {
        const handleShowHint = () => setShowHint(true);
        document.addEventListener("show-hint", handleShowHint);
        return () => document.removeEventListener("show-hint", handleShowHint);
    }, []);

    const handleChange = (itemIdx, blankIdx, value, correctAnswer) => {
        const key = `${itemIdx}-${blankIdx}`;
        const isCorrect = normalize(value) === normalize(correctAnswer);

        setAnswers((prev) => ({
            ...prev,
            [key]: { value, isCorrect },
        }));
    };

    return (
        <div className="exercise-inner">
            {showHint && <ModalHtml html={hint} onClose={() => setShowHint(false)} />}

            <div className="scroll-container">
                <ul className="list">
                    {items.map((item, itemIdx) => {
                        const sentence = String(item.sentence ?? "");
                        const parts = sentence.split(/_{3,}/);
                        const correctAnswers = Array.isArray(item.answers) ? item.answers : [];
                        const blanksCount = Math.min(parts.length - 1, correctAnswers.length);

                        return (
                            <li key={itemIdx} className="list-item">
                                {parts.map((part, partIdx) => {
                                    const key = `${itemIdx}-${partIdx}`;
                                    const stored = answers[key];
                                    const value = stored?.value ?? "";
                                    const hasValue = value.trim() !== "";
                                    const isCorrect = stored?.isCorrect;
                                    const showInput = partIdx < blanksCount;
                                    const correctAnswer = correctAnswers[partIdx] ?? "";

                                    const inputClass = hasValue
                                        ? isCorrect
                                            ? "input correct"
                                            : "input incorrect"
                                        : "input";

                                    return (
                                        <span key={partIdx}>
                                            {part}
                                            {showInput ? (
                                                <ExpandingInput
                                                    type="text"
                                                    value={value}
                                                    onChange={(e) =>
                                                        handleChange(itemIdx, partIdx, e.target.value, correctAnswer)
                                                    }
                                                    className={inputClass}
                                                    minWidth={80}
                                                    maxWidth={200}
                                                    aria-label={`Ersatzartikel blank ${partIdx + 1} (item ${itemIdx + 1})`}
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

Ersatzartikel.headerButton = (
    <button
        type="button"
        className="hint-button"
        onClick={() => document.dispatchEvent(new CustomEvent("show-hint"))}
    >
        !
    </button>
);

Ersatzartikel.instructions = data.instructions;
Ersatzartikel.title = data.title;
