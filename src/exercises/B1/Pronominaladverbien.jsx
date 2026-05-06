import { useEffect, useMemo, useState } from "react";
import ModalHtml from "../../components/ModalHtml";
import ExpandingInput from "../../components/ExpandingInput";
import ProgressiveList from "../../components/ProgressiveList";
import { useLocale } from "../../contexts/LocaleContext";
import { usePersistentAnswers } from "../../hooks/usePersistentAnswers";

import data from "../../../data/B1/pronominaladverbien.json";
import slide1Ru from "../../../data/B1/images/pronominaladverbien1.html?raw";
import slide2Ru from "../../../data/B1/images/pronominaladverbien2.html?raw";
import slide3Ru from "../../../data/B1/images/pronominaladverbien3.html?raw";
import slide1En from "../../../data/B1/images/en/pronominaladverbien1.html?raw";
import slide2En from "../../../data/B1/images/en/pronominaladverbien2.html?raw";
import slide3En from "../../../data/B1/images/en/pronominaladverbien3.html?raw";

import "../../css/exercises/Common.css";

const STORAGE_KEY = "pronominaladverbien-answers";

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

function getAnswers(item) {
    if (Array.isArray(item?.answers)) return item.answers.map(String);
    if (Array.isArray(item?.answer)) return item.answer.map(String);
    if (item?.answer != null) return [String(item.answer)];
    return [];
}

export default function Pronominaladverbien() {
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
    const items = useMemo(() => (Array.isArray(data.items) ? data.items : []), []);

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
                <ProgressiveList items={items} className="list">
                    {(item, itemIdx) => {
                        const sentence = getSentenceText(item.sentence, locale);
                        const parts = String(sentence ?? "").split(/_{3,}/);
                        const correctAnswers = getAnswers(item);
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
                                                    minWidth={150}
                                                    mobileMinWidth={65}
                                                    tabletMinWidth={75}
                                                    maxWidth={240}
                                                    enableHint
                                                    hintValue={correctAnswer}
                                                    aria-label={`Pronominaladverbien blank ${partIdx + 1} (item ${itemIdx + 1})`}
                                                />
                                            ) : null}
                                        </span>
                                    );
                                })}
                            </li>
                        );
                    }}
                </ProgressiveList>
            </div>
        </div>
    );
}

Pronominaladverbien.headerButton = (
    <button
        type="button"
        className="hint-button"
        onClick={() => document.dispatchEvent(new CustomEvent("show-hint"))}
    >
        !
    </button>
);

Pronominaladverbien.instructions = data.instructions;
Pronominaladverbien.title = data.title;
