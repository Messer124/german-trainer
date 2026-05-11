import { useEffect, useMemo, useState } from "react";
import ModalHtml from "../../components/ModalHtml";
import ExpandingInput from "../../components/ExpandingInput";
import ProgressiveList from "../../components/ProgressiveList";
import { useLocale } from "../../contexts/LocaleContext";
import { usePersistentAnswers } from "../../hooks/usePersistentAnswers";

import data from "../../../data/B1/steigerungVonAdjektiven.json";
import slide1Ru from "../../../data/B1/images/steigerungVonAdjektiven1.html?raw";
import slide2Ru from "../../../data/B1/images/steigerungVonAdjektiven2.html?raw";
import slide3Ru from "../../../data/B1/images/steigerungVonAdjektiven3.html?raw";
import slide4Ru from "../../../data/B1/images/steigerungVonAdjektiven4.html?raw";
import slide1En from "../../../data/B1/images/en/steigerungVonAdjektiven1.html?raw";
import slide2En from "../../../data/B1/images/en/steigerungVonAdjektiven2.html?raw";
import slide3En from "../../../data/B1/images/en/steigerungVonAdjektiven3.html?raw";
import slide4En from "../../../data/B1/images/en/steigerungVonAdjektiven4.html?raw";

import "../../css/exercises/Common.css";

const STORAGE_KEY = "steigerung-von-adjektiven-answers";

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

function getAnswerArray(item) {
    if (Array.isArray(item?.answers)) return item.answers.map(String);
    if (Array.isArray(item?.answer)) return item.answer.map(String);
    if (item?.answer != null) return [String(item.answer)];
    return [];
}

function getRows(rawItems, locale) {
    const items = Array.isArray(rawItems) ? rawItems : [];
    const rows = [];
    let sentenceIndex = 0;

    items.forEach((item, rawIndex) => {
        if (!item || typeof item !== "object") return;

        const hasSentence = Object.prototype.hasOwnProperty.call(item, "sentence");
        const answers = getAnswerArray(item);

        if (typeof item.id === "string" && !hasSentence && answers.length === 0) {
            const label = getLocalizedText(item.label, locale);
            if (!label) return;

            rows.push({
                type: "divider",
                key: `steigerung-von-adjektiven-divider-${rawIndex}-${item.id}`,
                label,
            });
            return;
        }

        if (!hasSentence || answers.length === 0) return;

        rows.push({
            type: "sentence",
            key: `steigerung-von-adjektiven-sentence-${sentenceIndex}`,
            sentenceIndex,
            sentence: getLocalizedText(item.sentence, locale),
            answers,
        });
        sentenceIndex += 1;
    });

    return rows;
}

export default function SteigerungVonAdjektiven() {
    const { locale } = useLocale();
    const [answers, setAnswers] = usePersistentAnswers(STORAGE_KEY, {});
    const [showHint, setShowHint] = useState(false);

    const slides = useMemo(
        () =>
            locale === "en"
                ? [slide1En, slide2En, slide3En, slide4En]
                : [slide1Ru, slide2Ru, slide3Ru, slide4Ru],
        [locale]
    );
    const rows = useMemo(() => getRows(data.items, locale), [locale]);

    useEffect(() => {
        const handleShowHint = () => setShowHint(true);
        document.addEventListener("show-hint", handleShowHint);
        return () => document.removeEventListener("show-hint", handleShowHint);
    }, []);

    const handleChange = (sentenceIdx, blankIdx, value, correctAnswer) => {
        const key = `${sentenceIdx}-${blankIdx}`;
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
                <ProgressiveList items={rows} className="list">
                    {(row) => {
                        if (row.type === "divider") {
                            return (
                                <li key={row.key} className="exercise-section-divider">
                                    <span>{row.label}</span>
                                </li>
                            );
                        }

                        const sentence = row.sentence;
                        const answerArray = row.answers;
                        const parts = sentence.split(/_{3,}/);

                        return (
                            <li key={row.key} className="list-item">
                                {parts.map((part, idx) => {
                                    const key = `${row.sentenceIndex}-${idx}`;
                                    const value = answers[key]?.value ?? "";
                                    const isCorrect = answers[key]?.isCorrect;

                                    let inputClass = "input";
                                    if (value.trim() !== "") {
                                        inputClass += isCorrect ? " correct" : " incorrect";
                                    }

                                    return (
                                        <span key={idx}>
                                            {part}
                                            {idx < answerArray.length ? (
                                                <ExpandingInput
                                                    type="text"
                                                    value={value}
                                                    onChange={(e) =>
                                                        handleChange(
                                                            row.sentenceIndex,
                                                            idx,
                                                            e.target.value,
                                                            answerArray[idx]
                                                        )
                                                    }
                                                    className={inputClass}
                                                    minWidth={80}
                                                    mobileMinWidth={35}
                                                    tabletMinWidth={40}
                                                    maxWidth={100}
                                                    aria-label={`Steigerung von Adjektiven blank ${idx + 1} (sentence ${row.sentenceIndex + 1})`}
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

SteigerungVonAdjektiven.headerButton = (
    <button
        type="button"
        className="hint-button"
        onClick={() => document.dispatchEvent(new CustomEvent("show-hint"))}
    >
        !
    </button>
);

SteigerungVonAdjektiven.instructions = data.instructions;
SteigerungVonAdjektiven.title = data.title;
