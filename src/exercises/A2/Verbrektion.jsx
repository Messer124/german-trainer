import { useEffect, useMemo, useState } from "react";
import ModalHtml from "../../components/ModalHtml";
import ExpandingInput from "../../components/ExpandingInput";
import { useLocale } from "../../contexts/LocaleContext";
import { usePersistentAnswers } from "../../hooks/usePersistentAnswers";

import data from "../../../data/A2/verbrektion.json";
import slide1Ru from "../../../data/A2/images/verbrektion1.html?raw";
import slide2Ru from "../../../data/A2/images/verbrektion2.html?raw";
import slide3Ru from "../../../data/A2/images/verbrektion3.html?raw";
import slide1En from "../../../data/A2/images/en/verbrektion1.html?raw";
import slide2En from "../../../data/A2/images/en/verbrektion2.html?raw";
import slide3En from "../../../data/A2/images/en/verbrektion3.html?raw";

import "../../css/exercises/Common.css";

const STORAGE_KEY = "verbrektion-answers";

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

function getSentenceText(rawSentence, locale) {
    if (typeof rawSentence === "string") return rawSentence;
    if (rawSentence && typeof rawSentence === "object") {
        return rawSentence[locale] ?? rawSentence.ru ?? rawSentence.en ?? "";
    }
    return "";
}

export default function Verbrektion() {
    const { locale } = useLocale();
    const [answers, setAnswers] = usePersistentAnswers(STORAGE_KEY, {});
    const [showHint, setShowHint] = useState(false);

    const slides = useMemo(
        () =>
            locale === "en"
                ? [slide1En, slide2En, slide3En]
                : [slide1Ru, slide2Ru, slide3Ru],
        [locale]
    );
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
            {showHint && (
                <ModalHtml images={slides} initialIndex={0} onClose={() => setShowHint(false)} />
            )}

            <div className="scroll-container">
                <ul className="list">
                    {items.map((item, itemIdx) => {
                        const sentence = getSentenceText(item.sentence, locale);
                        const parts = String(sentence ?? "").split(/_{3,}/);
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
                                                    maxWidth={220}
                                                    aria-label={`Verbrektion blank ${partIdx + 1} (item ${itemIdx + 1})`}
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

Verbrektion.headerButton = (
    <button
        type="button"
        className="hint-button"
        onClick={() => document.dispatchEvent(new CustomEvent("show-hint"))}
    >
        !
    </button>
);

Verbrektion.instructions = data.instructions;
Verbrektion.title = { ru: "Verbrektion", en: "Verbrektion" };
