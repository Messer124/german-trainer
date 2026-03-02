import { useEffect, useMemo, useState } from "react";
import ModalHtml from "../../components/ModalHtml";
import { usePersistentAnswers } from "../../hooks/usePersistentAnswers";
import ExpandingInput from "../../components/ExpandingInput";
import { useLocale } from "../../contexts/LocaleContext";

import data from "../../../data/A2/nDeklination.json";
import hint1Ru from "../../../data/A2/images/nDeklination1.html?raw";
import hint2Ru from "../../../data/A2/images/nDeklination2.html?raw";
import hint1En from "../../../data/A2/images/en/nDeklination1.html?raw";
import hint2En from "../../../data/A2/images/en/nDeklination2.html?raw";

import "../../css/exercises/Common.css";

const STORAGE_KEY = "n-deklination-answers";

function normalizeItems(rawItems) {
    if (Array.isArray(rawItems) && rawItems.length > 0 && Array.isArray(rawItems[0])) {
        return rawItems.flat();
    }
    return Array.isArray(rawItems) ? rawItems : [];
}

function getSentenceText(rawSentence, locale) {
    if (typeof rawSentence === "string") return rawSentence;
    if (rawSentence && typeof rawSentence === "object") {
        return rawSentence[locale] ?? rawSentence.ru ?? rawSentence.en ?? "";
    }
    return "";
}

function getArray(value) {
    return Array.isArray(value) ? value.map(String) : [];
}

function NDeklination() {
    const { locale } = useLocale();
    const [answers, setAnswers] = usePersistentAnswers(STORAGE_KEY, {});
    const [showHint, setShowHint] = useState(false);

    const hintSlides = useMemo(
        () => (locale === "en" ? [hint1En, hint2En] : [hint1Ru, hint2Ru]),
        [locale]
    );
    const items = useMemo(() => normalizeItems(data.items), []);

    useEffect(() => {
        const handleShowHint = () => setShowHint(true);
        document.addEventListener("show-hint", handleShowHint);
        return () => document.removeEventListener("show-hint", handleShowHint);
    }, []);

    const handleChange = (itemIdx, blankIdx, value, correct) => {
        const key = `${itemIdx}-${blankIdx}`;
        const isCorrect = value.trim().toLowerCase() === correct.trim().toLowerCase();

        setAnswers((prev) => ({
            ...prev,
            [key]: { value, isCorrect },
        }));
    };

    const renderItem = (item, itemIdx) => {
        const sentence = getSentenceText(item.sentence, locale);
        const parts = sentence.split("___");
        const correctAnswers = getArray(item.answer);
        const nouns = getArray(item.noun);
        const blanksCount = Math.min(parts.length - 1, correctAnswers.length);

        return (
            <li key={itemIdx} className="list-item">
                {parts.map((part, idx) => {
                    const key = `${itemIdx}-${idx}`;
                    const stored = answers[key];
                    const value = stored?.value || "";
                    const trimmed = value.trim();
                    const isCorrect = stored?.isCorrect;

                    let inputClass = "input";
                    if (trimmed !== "") {
                        inputClass += isCorrect ? " correct" : " incorrect";
                    }

                    const showInput = idx < blanksCount;
                    const correct = correctAnswers[idx] ?? "";
                    const placeholder = nouns[idx] ?? undefined;

                    return (
                        <span key={idx}>
                            {part}
                            {showInput ? (
                                <ExpandingInput
                                    type="text"
                                    value={value}
                                    placeholder={placeholder}
                                    onChange={(e) => handleChange(itemIdx, idx, e.target.value, correct)}
                                    className={inputClass}
                                    minWidth={64}
                                    mobileMinWidth={40}
                                    tabletMinWidth={52}
                                    maxWidth={260}
                                    aria-label={`N-Deklination blank ${idx + 1} (sentence ${itemIdx + 1})`}
                                />
                            ) : null}
                        </span>
                    );
                })}
            </li>
        );
    };

    return (
        <div className="exercise-inner">
            {showHint && (
                <ModalHtml images={hintSlides} initialIndex={0} onClose={() => setShowHint(false)} />
            )}

            <div className="scroll-container">
                <ul className="list">{items.map((item, idx) => renderItem(item, idx))}</ul>
            </div>
        </div>
    );
}

NDeklination.headerButton = (
    <button
        type="button"
        className="hint-button"
        onClick={() => document.dispatchEvent(new CustomEvent("show-hint"))}
    >
        !
    </button>
);

NDeklination.instructions = data.instructions;
NDeklination.title = data.title;

export default NDeklination;
