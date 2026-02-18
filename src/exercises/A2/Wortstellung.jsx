import { Eye } from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";
import { useLocale } from "../../contexts/LocaleContext";
import ModalHtml from "../../components/ModalHtml";
import ExpandingInput from "../../components/ExpandingInput";
import { usePersistentAnswers } from "../../hooks/usePersistentAnswers";

import data from "../../../data/A2/wortstellung.json";
import hintRu from "../../../data/A2/images/wortstellung.html?raw";
import hintEn from "../../../data/A2/images/en/wortstellung.html?raw";

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
    const [previewValues, setPreviewValues] = useState({});
    const previewTimersRef = useRef({});
    const hint = locale === "en" ? hintEn : hintRu;

    const items = useMemo(() => normalizeItems(data.items), []);

    useEffect(() => {
        const handleShowHint = () => setShowHint(true);
        document.addEventListener("show-hint", handleShowHint);
        return () => document.removeEventListener("show-hint", handleShowHint);
    }, []);

    useEffect(() => {
        return () => {
            Object.values(previewTimersRef.current).forEach((id) => clearTimeout(id));
        };
    }, []);

    const handleChange = (index, value) => {
        const key = `wortstellung-${index}`;
        const correct = normalize(items[index]?.answer);
        const isCorrect = normalize(value) === correct;

        if (previewTimersRef.current[key]) {
            clearTimeout(previewTimersRef.current[key]);
            delete previewTimersRef.current[key];
        }
        if (previewValues[key] != null) {
            setPreviewValues((prev) => {
                const next = { ...prev };
                delete next[key];
                return next;
            });
        }

        setAnswers((prev) => ({
            ...prev,
            [key]: { value, isCorrect },
        }));
    };

    const showAnswerPreview = (index) => {
        const key = `wortstellung-${index}`;
        const answer = String(items[index]?.answer ?? "");

        if (!answer) return;

        if (previewTimersRef.current[key]) {
            clearTimeout(previewTimersRef.current[key]);
        }

        setPreviewValues((prev) => ({ ...prev, [key]: answer }));

        previewTimersRef.current[key] = setTimeout(() => {
            setPreviewValues((prev) => {
                const next = { ...prev };
                delete next[key];
                return next;
            });
            delete previewTimersRef.current[key];
        }, 2000);
    };

    return (
        <div className="exercise-inner">
            {showHint && <ModalHtml html={hint} onClose={() => setShowHint(false)} />}

            <div className="scroll-container">
                <ul className="list">
                    {items.map((item, index) => {
                        const key = `wortstellung-${index}`;
                        const value = answers[key]?.value ?? "";
                        const visibleValue = previewValues[key] ?? value;
                        const trimmed = visibleValue.trim();
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
                                <ExpandingInput
                                    type="text"
                                    className={inputClass}
                                    value={visibleValue}
                                    onChange={(e) => handleChange(index, e.target.value)}
                                    minWidth={180}
                                    maxWidth={720}
                                    readOnly={previewValues[key] != null}
                                    aria-label={`Wortstellung answer ${index + 1}`}
                                />
                                <button
                                    type="button"
                                    className="eye-container eye-container--button"
                                    onClick={() => showAnswerPreview(index)}
                                    aria-label={`Show answer for sentence ${index + 1}`}
                                >
                                    <span><Eye size={18} /></span>
                                </button>
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
