import { useEffect, useMemo, useState } from "react";
import ModalHtml from "../../components/ModalHtml";
import ExpandingInput from "../../components/ExpandingInput";
import { useLocale } from "../../contexts/LocaleContext";
import { usePersistentAnswers } from "../../hooks/usePersistentAnswers";

import data from "../../../data/A2/steigerungDerAdjektive.json";
import slide1Ru from "../../../data/A2/images/steigerungderadjektive1.html?raw";
import slide2Ru from "../../../data/A2/images/steigerungderadjektive2.html?raw";
import slide3Ru from "../../../data/A2/images/steigerungderadjektive3.html?raw";
import slide1En from "../../../data/A2/images/en/steigerungderadjektive1.html?raw";
import slide2En from "../../../data/A2/images/en/steigerungderadjektive2.html?raw";
import slide3En from "../../../data/A2/images/en/steigerungderadjektive3.html?raw";

import "../../css/exercises/Common.css";

const STORAGE_KEY = "steigerung-der-adjektive-answers";

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

function getAnswerArray(item) {
    if (Array.isArray(item?.answers)) return item.answers.map(String);
    if (Array.isArray(item?.answer)) return item.answer.map(String);
    return [];
}

export default function SteigerungDerAdjektive() {
    const { locale } = useLocale();
    const [answers, setAnswers] = usePersistentAnswers(STORAGE_KEY, {});
    const [showHint, setShowHint] = useState(false);

    const slides = useMemo(
        () => (locale === "en" ? [slide1En, slide2En, slide3En] : [slide1Ru, slide2Ru, slide3Ru]),
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
            [key]: {
                value,
                isCorrect,
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
                    {items.map((item, itemIdx) => {
                        const sentence = getSentenceText(item.sentence, locale);
                        const answerArray = getAnswerArray(item);
                        const parts = sentence.split(/_{3,}/);

                        return (
                            <li key={itemIdx} className="list-item">
                                {parts.map((part, partIdx) => {
                                    const key = `${itemIdx}-${partIdx}`;
                                    const value = answers[key]?.value ?? "";
                                    const isCorrect = answers[key]?.isCorrect;

                                    let inputClass = "input";
                                    if (value.trim() !== "") {
                                        inputClass += isCorrect ? " correct" : " incorrect";
                                    }

                                    return (
                                        <span key={partIdx}>
                                            {part}
                                            {partIdx < answerArray.length ? (
                                                <ExpandingInput
                                                    type="text"
                                                    value={value}
                                                    onChange={(e) =>
                                                        handleChange(
                                                            itemIdx,
                                                            partIdx,
                                                            e.target.value,
                                                            answerArray[partIdx]
                                                        )
                                                    }
                                                    className={inputClass}
                                                    minWidth={120}
                                                    mobileMinWidth={60}
                                                    tabletMinWidth={90}
                                                    maxWidth={220}
                                                    aria-label={`Steigerung der Adjektive blank ${partIdx + 1} (item ${itemIdx + 1})`}
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

SteigerungDerAdjektive.headerButton = (
    <button
        type="button"
        className="hint-button"
        onClick={() => document.dispatchEvent(new CustomEvent("show-hint"))}
    >
        !
    </button>
);

SteigerungDerAdjektive.instructions = data.instructions;
SteigerungDerAdjektive.title = data.title;
