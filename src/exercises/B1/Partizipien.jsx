import { useEffect, useMemo, useState } from "react";
import ModalHtml from "../../components/ModalHtml";
import ExpandingInput from "../../components/ExpandingInput";
import ProgressiveList from "../../components/ProgressiveList";
import { useLocale } from "../../contexts/LocaleContext";
import { usePersistentAnswers } from "../../hooks/usePersistentAnswers";

import data from "../../../data/B1/partizipien.json";
import slide1Ru from "../../../data/B1/images/partizipien1.html?raw";
import slide2Ru from "../../../data/B1/images/partizipien2.html?raw";
import slide3Ru from "../../../data/B1/images/partizipien3.html?raw";
import slide1En from "../../../data/B1/images/en/partizipien1.html?raw";
import slide2En from "../../../data/B1/images/en/partizipien2.html?raw";
import slide3En from "../../../data/B1/images/en/partizipien3.html?raw";

import "../../css/exercises/Common.css";

const STORAGE_KEY = "partizipien-answers";
const PLACEHOLDER_TOKEN = "___";

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

function getAnswer(item) {
    if (Array.isArray(item?.answer)) return String(item.answer[0] ?? "");
    if (Array.isArray(item?.answers)) return String(item.answers[0] ?? "");
    return String(item?.answer ?? "");
}

function getRows(rawItems) {
    const items = Array.isArray(rawItems) ? rawItems : [];
    const rows = [];
    let currentSection = "insert";
    let sentenceIndex = 0;

    items.forEach((item, rawIndex) => {
        if (!item || typeof item !== "object") return;

        const hasSentence = Object.prototype.hasOwnProperty.call(item, "sentence");
        const hasAnswer = Object.prototype.hasOwnProperty.call(item, "answer")
            || Object.prototype.hasOwnProperty.call(item, "answers");

        if (typeof item.id === "string" && !hasSentence && !hasAnswer) {
            currentSection = item.id;
            rows.push({
                type: "divider",
                key: `partizipien-divider-${rawIndex}-${item.id}`,
                id: item.id,
                label: item.label,
            });
            return;
        }

        if (!hasSentence || !hasAnswer) return;

        rows.push({
            type: "item",
            section: currentSection,
            key: `partizipien-item-${sentenceIndex}`,
            sentenceIndex,
            sentence: item.sentence,
            placeholder: item.placeholder,
            answer: getAnswer(item),
        });
        sentenceIndex += 1;
    });

    return rows;
}

function splitByPlaceholder(sentence) {
    const parts = String(sentence ?? "").split(PLACEHOLDER_TOKEN);
    if (parts.length < 2) return null;

    return {
        left: parts[0] ?? "",
        right: parts.slice(1).join(PLACEHOLDER_TOKEN),
    };
}

export default function Partizipien() {
    const { locale } = useLocale();
    const [answers, setAnswers] = usePersistentAnswers(STORAGE_KEY, {});
    const [showHint, setShowHint] = useState(false);

    const slides = useMemo(
        () => (locale === "en" ? [slide1En, slide2En, slide3En] : [slide1Ru, slide2Ru, slide3Ru]),
        [locale]
    );
    const rows = useMemo(() => getRows(data.items), []);

    useEffect(() => {
        const handleShowHint = () => setShowHint(true);
        document.addEventListener("show-hint", handleShowHint);
        return () => document.removeEventListener("show-hint", handleShowHint);
    }, []);

    const handleChange = (itemIdx, value, correctAnswer) => {
        const key = `partizipien-${itemIdx}`;
        const isCorrect = normalize(value) === normalize(correctAnswer);

        setAnswers((prev) => ({
            ...prev,
            [key]: {
                value,
                isCorrect,
            },
        }));
    };

    const renderInsert = (row) => {
        const sentence = getLocalizedText(row.sentence, locale);
        const placeholder = getLocalizedText(row.placeholder, locale);
        const answer = row.answer;
        const placeholderParts = splitByPlaceholder(sentence);
        const key = `partizipien-${row.sentenceIndex}`;
        const value = answers[key]?.value ?? "";
        const isCorrect = answers[key]?.isCorrect;
        const hasValue = value.trim() !== "";
        const inputClass = hasValue
            ? isCorrect
                ? "autosize-input correct"
                : "autosize-input incorrect"
            : "autosize-input";

        const input = (
            <ExpandingInput
                type="text"
                value={value}
                onChange={(e) => handleChange(row.sentenceIndex, e.target.value, answer)}
                className={inputClass}
                placeholder={placeholder}
                enableHint
                hintValue={answer}
                minWidth={110}
                mobileMinWidth={75}
                tabletMinWidth={90}
                maxWidth={300}
                aria-label={`Partizipien answer ${row.sentenceIndex + 1}`}
            />
        );

        return (
            <li key={row.key} className="list-item">
                {placeholderParts ? (
                    <>
                        {placeholderParts.left}
                        {input}
                        {placeholderParts.right}
                    </>
                ) : (
                    <>
                        <span className="sentence">{sentence} —</span>
                        {input}
                    </>
                )}
            </li>
        );
    };

    const renderTranslate = (row) => {
        const sentence = getLocalizedText(row.sentence, locale);
        const answer = row.answer;
        const key = `partizipien-${row.sentenceIndex}`;
        const value = answers[key]?.value ?? "";
        const isCorrect = answers[key]?.isCorrect;
        const hasValue = value.trim() !== "";
        const inputClass = hasValue
            ? isCorrect
                ? "autosize-input correct"
                : "autosize-input incorrect"
            : "autosize-input";

        return (
            <li key={row.key} className="list-item">
                <span className="sentence">{sentence} —</span>
                <ExpandingInput
                    type="text"
                    value={value}
                    onChange={(e) => handleChange(row.sentenceIndex, e.target.value, answer)}
                    className={inputClass}
                    enableHint
                    hintValue={answer}
                    minWidth={260}
                    mobileMinWidth={130}
                    tabletMinWidth={190}
                    maxWidth={720}
                    aria-label={`Partizipien translation ${row.sentenceIndex + 1}`}
                />
            </li>
        );
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
                                    <span>{getLocalizedText(row.label, locale)}</span>
                                </li>
                            );
                        }

                        if (row.section === "translate") return renderTranslate(row);
                        return renderInsert(row);
                    }}
                </ProgressiveList>
            </div>
        </div>
    );
}

Partizipien.headerButton = (
    <button
        type="button"
        className="hint-button"
        onClick={() => document.dispatchEvent(new CustomEvent("show-hint"))}
    >
        !
    </button>
);

Partizipien.instructions = data.instructions;
Partizipien.title = data.title;
