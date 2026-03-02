import { useEffect, useMemo, useState } from "react";
import ModalHtml from "../../components/ModalHtml";
import ExpandingInput from "../../components/ExpandingInput";
import { useLocale } from "../../contexts/LocaleContext";
import { usePersistentAnswers } from "../../hooks/usePersistentAnswers";

import data from "../../../data/A2/welchWasFuerEin.json";
import slide1Ru from "../../../data/A2/images/welchWasFuerEin1.html?raw";
import slide2Ru from "../../../data/A2/images/welchWasFuerEin2.html?raw";
import slide1En from "../../../data/A2/images/en/welchWasFuerEin1.html?raw";
import slide2En from "../../../data/A2/images/en/welchWasFuerEin2.html?raw";

import "../../css/exercises/Common.css";

const STORAGE_KEY = "welch-was-fuer-ein-answers";

function normalize(value) {
    return String(value ?? "").trim().toLowerCase();
}

function getSentenceText(rawSentence, locale) {
    if (typeof rawSentence === "string") return rawSentence;
    if (rawSentence && typeof rawSentence === "object") {
        return rawSentence[locale] ?? rawSentence.ru ?? rawSentence.en ?? "";
    }
    return "";
}

export default function WelchWasFuerEin() {
    const { locale } = useLocale();
    const [answers, setAnswers] = usePersistentAnswers(STORAGE_KEY, {});
    const [showHint, setShowHint] = useState(false);

    const slides = useMemo(
        () => (locale === "en" ? [slide1En, slide2En] : [slide1Ru, slide2Ru]),
        [locale]
    );
    const items = useMemo(() => (Array.isArray(data.items) ? data.items : []), []);

    useEffect(() => {
        const handleShowHint = () => setShowHint(true);
        document.addEventListener("show-hint", handleShowHint);
        return () => document.removeEventListener("show-hint", handleShowHint);
    }, []);

    const handleChange = (index, value) => {
        const correct = normalize(items[index]?.answer);

        setAnswers((prev) => ({
            ...prev,
            [index]: {
                value,
                isCorrect: normalize(value) === correct,
            },
        }));
    };

    return (
        <div className="exercise-inner">
            {showHint && (
                <ModalHtml images={slides} initialIndex={0} onClose={() => setShowHint(false)} />
            )}

            <div className="scroll-container">
                <ul className="list">
                    {items.map((item, index) => {
                        const value = answers[index]?.value || "";
                        const isCorrect = answers[index]?.isCorrect;
                        const sentence = getSentenceText(item.sentence, locale);

                        const parts = String(sentence).split("___");
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
                                    minWidth={110}
                                    mobileMinWidth={60}
                                    tabletMinWidth={85}
                                    maxWidth={300}
                                    aria-label={`Welch / Was für ein ${index + 1}`}
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

WelchWasFuerEin.headerButton = (
    <button
        type="button"
        className="hint-button"
        onClick={() => document.dispatchEvent(new CustomEvent("show-hint"))}
    >
        !
    </button>
);

WelchWasFuerEin.instructions = data.instructions;
WelchWasFuerEin.title = data.title;
