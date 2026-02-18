import { Eye } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { useLocale } from "../../contexts/LocaleContext";
import ModalHtml from "../../components/ModalHtml";
import { usePersistentAnswers } from "../../hooks/usePersistentAnswers";

import data from "../../../data/A2/wortstellung.json";
import hint from "../../../data/A2/images/wortstellung.html?raw";

import "../../css/exercises/Common.css";

const STORAGE_KEY = "wortstellung-answers";

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

export default function Wortstellung() {
    const { locale } = useLocale();
    const [answers, setAnswers] = usePersistentAnswers(STORAGE_KEY, {});
    const [showHint, setShowHint] = useState(false);

    const items = useMemo(() => normalizeItems(data.items), []);

    useEffect(() => {
        const handleShowHint = () => setShowHint(true);
        document.addEventListener("show-hint", handleShowHint);
        return () => document.removeEventListener("show-hint", handleShowHint);
    }, []);

    const handleChange = (index, value) => {
        const key = `wortstellung-${index}`;
        const correct = normalize(items[index]?.answer);
        const isCorrect = normalize(value) === correct;

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
                    {items.map((item, index) => {
                        const key = `wortstellung-${index}`;
                        const value = answers[key]?.value ?? "";
                        const trimmed = value.trim();
                        const isCorrect = answers[key]?.isCorrect;
                        const inputClass =
                            trimmed === ""
                                ? "autosize-input"
                                : isCorrect
                                    ? "autosize-input correct"
                                    : "autosize-input incorrect";

                        return (
                            <li key={index}>
                                <span className="sentence">{item.sentence?.[locale]}</span>
                                <input
                                    type="text"
                                    className={inputClass}
                                    value={value}
                                    onChange={(e) => handleChange(index, e.target.value)}
                                    style={{ width: `${Math.max(trimmed.length + 1, 8)}ch` }}
                                />
                                <span className="eye-container">
                                    <span><Eye size={18} /></span>
                                    <span className="eye">{item.answer}</span>
                                </span>
                            </li>
                        );
                    })}
                </ul>
            </div>
        </div>
    );
}

Wortstellung.headerButton = (
    <button
        type="button"
        className="hint-button"
        onClick={() => document.dispatchEvent(new CustomEvent("show-hint"))}
    >
        !
    </button>
);

Wortstellung.instructions = data.instructions;
Wortstellung.title = { ru: "Wortstellung", en: "Word order" };
