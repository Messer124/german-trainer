import { useEffect, useMemo, useState } from "react";
import ModalHtml from "../../components/ModalHtml";
import ExpandingInput from "../../components/ExpandingInput";
import SectionedProgressiveList from "../../components/SectionedProgressiveList";
import { useLocale } from "../../contexts/LocaleContext";
import { usePersistentAnswers } from "../../hooks/usePersistentAnswers";
import { normalizeExerciseSections } from "../../utils/sectionedExercise";

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
    const sections = useMemo(
        () => normalizeExerciseSections(data, locale, "partizipien"),
        [locale]
    );

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
        const sentence = row.sentence;
        const placeholder = row.placeholder;
        const answer = row.answers[0] ?? "";
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
        const sentence = row.sentence;
        const answer = row.answers[0] ?? "";
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

            <SectionedProgressiveList
                sections={sections}
                className="list"
            >
                    {(row) => {
                        if (row.sectionType === "translate") return renderTranslate(row);
                        return renderInsert(row);
                    }}
            </SectionedProgressiveList>
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
