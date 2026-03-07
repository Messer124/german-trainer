import { useEffect, useMemo, useState } from "react";
import { usePersistentAnswers } from "../../hooks/usePersistentAnswers";
import { useLocale } from "../../contexts/LocaleContext";
import data from "../../../data/A1-2/prepositionsPlace.json";
import hintRu from "../../../data/A1-2/images/prepositionsPlace.html?raw";
import hintEn from "../../../data/A1-2/images/en/prepositionsPlace.html?raw";
import "../../css/exercises/Common.css";
import ModalHtml from "../../components/ModalHtml";
import ExpandingInput from "../../components/ExpandingInput";

const STORAGE_KEY = "prepositions-place-answers";

function flattenItems(items) {
    if (!Array.isArray(items)) return [];
    if (Array.isArray(items[0])) return items.flat();
    return items;
}

function normalize(value) {
    return String(value ?? "")
        .trim()
        .toLowerCase()
        .replace(/\s+/g, " ");
}

export default function Prepositions() {
    const { locale } = useLocale();
    const [answers, setAnswers] = usePersistentAnswers(STORAGE_KEY, {});
    const [showHint, setShowHint] = useState(false);

    const items = useMemo(() => flattenItems(data.items), [data.items]);

    useEffect(() => {
        const handleShowHint = () => setShowHint(true);
        document.addEventListener("show-hint", handleShowHint);
        return () => document.removeEventListener("show-hint", handleShowHint);
    }, []);

    const getAcceptedAnswers = (sentenceIdx, blankIdx) => {
        const item = items[sentenceIdx];

        if (!item) return [];

        if (Array.isArray(item.answers)) {
            const raw = item.answers[blankIdx];

            if (Array.isArray(raw)) {
                return raw.map((value) => String(value ?? "").trim()).filter(Boolean);
            }

            if (typeof raw === "string") {
                return [raw.trim()].filter(Boolean);
            }
        }

        const raw = item.answer;

        if (Array.isArray(raw)) {
            return [String(raw[blankIdx] ?? "").trim()].filter(Boolean);
        }

        if (typeof raw === "string") {
            const parts = raw
                .split(",")
                .map((part) => part.trim())
                .filter(Boolean);

            return [String(parts[blankIdx] ?? "").trim()].filter(Boolean);
        }

        return [];
    };

    const handleChange = (sentenceIdx, blankIdx, value) => {
        const acceptedAnswers = getAcceptedAnswers(sentenceIdx, blankIdx);
        const normalizedValue = normalize(value);
        const isCorrect = acceptedAnswers.some(
            (answer) => normalize(answer) === normalizedValue
        );
        const key = `${sentenceIdx}-${blankIdx}`;

        setAnswers((prev) => ({
            ...prev,
            [key]: {
                value,
                isCorrect,
            },
        }));
    };

    const getBlanksCount = (item, sentenceIdx) => {
        const sentenceParts = String(item.sentence || "").split("___");
        return Math.max(0, sentenceParts.length - 1);
    };

    const renderSentence = (item, sentenceIdx) => {
        const parts = String(item.sentence || "").split("___");
        const blanksCount = getBlanksCount(item, sentenceIdx);

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
                            {idx < blanksCount && (
                                <ExpandingInput
                                    type="text"
                                    value={inputValue}
                                    onChange={(e) => handleChange(sentenceIdx, idx, e.target.value)}
                                    className={inputClass}
                                    autoComplete="off"
                                    spellCheck={false}
                                    minWidth={110}
                                    maxWidth={260}
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
                    html={locale === "en" ? hintEn : hintRu}
                    onClose={() => setShowHint(false)}
                />
            )}

            <div className="scroll-container">
                <ul className="list">{data.items.map((item, idx) => renderSentence(item, idx))}</ul>
            </div>
        </div>
    );
}

Prepositions.headerButton = (
    <button
        type="button"
        className="hint-button"
        onClick={() => document.dispatchEvent(new CustomEvent("show-hint"))}
    >
        !
    </button>
);

Prepositions.instructions = data.instructions;
Prepositions.title = data.title;