import { Eye } from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";
import ModalHtml from "../../components/ModalHtml";
import ExpandingInput from "../../components/ExpandingInput";
import { useLocale } from "../../contexts/LocaleContext";
import { usePersistentAnswers } from "../../hooks/usePersistentAnswers";

import data from "../../../data/A2/plusquamperfekt.json";
import slideRu from "../../../data/A2/images/plusquamperfekt.html?raw";
import slideEn from "../../../data/A2/images/en/plusquamperfekt.html?raw";

import "../../css/exercises/Common.css";

const STORAGE_KEY = "plusquamperfekt-answers";

function normalize(value) {
    return String(value ?? "")
        .trim()
        .toLowerCase()
        .replace(/\s+/g, " ");
}

function getLocalizedText(raw, locale) {
    if (typeof raw === "string") return raw;
    if (raw && typeof raw === "object") {
        return raw[locale] ?? raw.ru ?? raw.en ?? "";
    }
    return "";
}

function getRows(rawItems, locale) {
    const items = Array.isArray(rawItems) ? rawItems : [];
    const rows = [];
    let sentenceIndex = 0;

    items.forEach((item, rawIndex) => {
        if (!item || typeof item !== "object") return;

        const hasSentence = Object.prototype.hasOwnProperty.call(item, "sentence");
        const hasAnswer = Object.prototype.hasOwnProperty.call(item, "answer");

        if (typeof item.id === "string" && !hasSentence && !hasAnswer) {
            const label = getLocalizedText(item.label, locale);
            if (!label) return;

            rows.push({
                type: "divider",
                key: `plusquamperfekt-divider-${rawIndex}-${item.id}`,
                label,
            });
            return;
        }

        if (!hasSentence || !hasAnswer) return;

        rows.push({
            type: "sentence",
            key: `plusquamperfekt-sentence-${sentenceIndex}`,
            sentenceIndex,
            sentence: typeof item.sentence === "string" ? item.sentence : getLocalizedText(item.sentence, locale),
            answer: String(item.answer ?? ""),
        });
        sentenceIndex += 1;
    });

    return rows;
}

export default function Plusquamperfekt() {
    const { locale } = useLocale();
    const [answers, setAnswers] = usePersistentAnswers(STORAGE_KEY, {});
    const [showHint, setShowHint] = useState(false);
    const [previewValues, setPreviewValues] = useState({});
    const previewTimersRef = useRef({});

    const slides = useMemo(() => (locale === "en" ? [slideEn] : [slideRu]), [locale]);
    const rows = useMemo(() => getRows(data.items, locale), [locale]);

    useEffect(() => {
        const handleShowHint = () => setShowHint(true);
        document.addEventListener("show-hint", handleShowHint);
        return () => document.removeEventListener("show-hint", handleShowHint);
    }, []);

    useEffect(() => {
        return () => {
            Object.values(previewTimersRef.current).forEach((timerId) => clearTimeout(timerId));
        };
    }, []);

    const handleChange = (sentenceIndex, value, correctAnswer) => {
        const key = `plusquamperfekt-${sentenceIndex}`;
        const isCorrect = normalize(value) === normalize(correctAnswer);

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

    const showAnswerPreview = (sentenceIndex, answer) => {
        const key = `plusquamperfekt-${sentenceIndex}`;
        const value = String(answer ?? "");
        if (!value) return;

        if (previewTimersRef.current[key]) {
            clearTimeout(previewTimersRef.current[key]);
        }

        setPreviewValues((prev) => ({ ...prev, [key]: value }));

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
            {showHint && (
                <ModalHtml images={slides} initialIndex={0} onClose={() => setShowHint(false)} />
            )}

            <div className="scroll-container">
                <ul className="list">
                    {rows.map((row) => {
                        if (row.type === "divider") {
                            return (
                                <li key={row.key} className="exercise-section-divider">
                                    <span>{row.label}</span>
                                </li>
                            );
                        }

                        const key = `plusquamperfekt-${row.sentenceIndex}`;
                        const value = answers[key]?.value ?? "";
                        const visibleValue = previewValues[key] ?? value;
                        const isCorrect = answers[key]?.isCorrect;
                        const hasValue = visibleValue.trim() !== "";
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
                                    value={visibleValue}
                                    onChange={(event) =>
                                        handleChange(row.sentenceIndex, event.target.value, row.answer)
                                    }
                                    minWidth={220}
                                    tabletMinWidth={170}
                                    mobileMinWidth={110}
                                    maxWidth={860}
                                    readOnly={previewValues[key] != null}
                                    aria-label={`Plusquamperfekt answer ${row.sentenceIndex + 1}`}
                                />
                                <button
                                    type="button"
                                    className="eye-container eye-container--button"
                                    onClick={() => showAnswerPreview(row.sentenceIndex, row.answer)}
                                    aria-label={`Show answer for sentence ${row.sentenceIndex + 1}`}
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

Plusquamperfekt.headerButton = (
    <button
        type="button"
        className="hint-button"
        onClick={() => document.dispatchEvent(new CustomEvent("show-hint"))}
    >
        !
    </button>
);

Plusquamperfekt.instructions = data.instructions;
Plusquamperfekt.title = data.title;
