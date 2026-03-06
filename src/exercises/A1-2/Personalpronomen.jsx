import { useEffect, useMemo, useState } from "react";

import "../../css/exercises/Common.css";
import ExpandingInput from "../../components/ExpandingInput";
import ModalHtml from "../../components/ModalHtml";
import { useLocale } from "../../contexts/LocaleContext";
import { usePersistentAnswers } from "../../hooks/usePersistentAnswers";

import data from "../../../data/A1-2/personalpronomen.json";
import hintRu from "../../../data/A1-2/images/personalpronomen.html?raw";
import hintEn from "../../../data/A1-2/images/en/personalpronomen.html?raw";

const STORAGE_KEY = "personal-pronouns-answers";
const PLACEHOLDER_TOKEN = "___";

function normalize(value) {
    return String(value ?? "")
        .trim()
        .toLowerCase()
        .replace(/\s+/g, " ");
}

function getLocalizedText(raw, locale) {
    if (typeof raw === "string") return raw;
    if (raw && typeof raw === "object") return raw[locale] ?? raw.ru ?? raw.en ?? "";
    return "";
}

export default function Personalpronomen() {
    const { locale } = useLocale();
    const [answers, setAnswers] = usePersistentAnswers(STORAGE_KEY, {});
    const [showHint, setShowHint] = useState(false);

    const slides = useMemo(() => (locale === "en" ? [hintEn] : [hintRu]), [locale]);

    useEffect(() => {
        const handleShowHint = () => setShowHint(true);
        document.addEventListener("show-hint", handleShowHint);
        return () => document.removeEventListener("show-hint", handleShowHint);
    }, []);

    const handleChange = (index, value, correctAnswer) => {
        const key = `personalpronomen-${index}`;
        const isCorrect = normalize(value) === normalize(correctAnswer);

        setAnswers((prev) => ({
            ...prev,
            [key]: { value, isCorrect },
        }));
    };

    const items = Array.isArray(data.items) ? data.items : [];

    return (
        <div className="exercise-inner">
            {showHint && (
                <ModalHtml images={slides} initialIndex={0} onClose={() => setShowHint(false)} />
            )}

            <div className="scroll-container">
                <ul className="list">
                    {items.map((item, idx) => {
                        const sentence = getLocalizedText(item.sentence, locale);
                        const placeholder = getLocalizedText(item.placeholder, locale);
                        const answer = String(item.answer ?? "");

                        const parts = String(sentence).split(PLACEHOLDER_TOKEN);
                        // Без фолбека: ожидаем ровно один "___".
                        const left = parts[0] ?? "";
                        const right = parts.slice(1).join(PLACEHOLDER_TOKEN);

                        const key = `personalpronomen-${idx}`;
                        const value = answers[key]?.value ?? "";

                        const isCorrect = answers[key]?.isCorrect;
                        const hasValue = value.trim() !== "";
                        const inputClass = hasValue
                            ? isCorrect
                                ? "autosize-input correct"
                                : "autosize-input incorrect"
                            : "autosize-input";

                        return (
                            <li key={key}>
                                {left}
                                <ExpandingInput
                                    type="text"
                                    className={inputClass}
                                    value={value}
                                    onChange={(e) => handleChange(idx, e.target.value, answer)}
                                    placeholder={placeholder}
                                    minWidth={70}
                                    tabletMinWidth={150}
                                    mobileMinWidth={120}
                                    maxWidth={720}
                                    enterKeyHint="next"
                                    aria-label={`Personalpronomen answer ${idx + 1}`}
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

Personalpronomen.headerButton = (
    <button
        type="button"
        className="hint-button"
        onClick={() => document.dispatchEvent(new CustomEvent("show-hint"))}
    >
        !
    </button>
);

Personalpronomen.instructions = data.instructions;
Personalpronomen.title = data.title;