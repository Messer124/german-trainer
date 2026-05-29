import { useMemo } from "react";
import ModalHtml from "../../components/ModalHtml";
import ExpandingInput from "../../components/ExpandingInput";
import ProgressiveList from "../../components/ProgressiveList";
import { useLocale } from "../../contexts/LocaleContext";
import { useTheoryModal } from "../../contexts/TheoryModalContext";
import { usePersistentAnswers } from "../../hooks/usePersistentAnswers";

import data from "../../../data/B1/substantivierteAdjektive.json";
import slide1Ru from "../../../data/B1/images/substantivierteAdjektive1.html?raw";
import slide2Ru from "../../../data/B1/images/substantivierteAdjektive2.html?raw";
import slide1En from "../../../data/B1/images/en/substantivierteAdjektive1.html?raw";
import slide2En from "../../../data/B1/images/en/substantivierteAdjektive2.html?raw";

import "../../css/exercises/Common.css";
import { normalizeAnswer } from "../../utils/answerUtils";

const STORAGE_KEY = "substantivierte-adjektive-answers";
const BLANK_PATTERN = /_{3,}/g;

function normalize(value) {
    return normalizeAnswer(value);
}

export default function SubstantivierteAdjektive() {
    const { locale } = useLocale();
    const [answers, setAnswers] = usePersistentAnswers(STORAGE_KEY, {});
    const { isTheoryOpen: showHint, closeTheory } = useTheoryModal();

    const slides = useMemo(
        () => (locale === "en" ? [slide1En, slide2En] : [slide1Ru, slide2Ru]),
        [locale]
    );

    const items = useMemo(() => (Array.isArray(data.items) ? data.items : []), []);


    const handleChange = (itemIndex, blankIndex, value, correctAnswer) => {
        const key = `substantivierte-adjektive-${itemIndex}-${blankIndex}`;
        const isCorrect = normalize(value) === normalize(correctAnswer);

        setAnswers((prev) => ({
            ...prev,
            [key]: { value, isCorrect },
        }));
    };

    const renderInput = (row, itemIndex, blankIndex) => {
        const correctAnswer = row.answers[blankIndex] ?? "";
        const key = `substantivierte-adjektive-${itemIndex}-${blankIndex}`;
        const value = answers[key]?.value ?? "";
        const isCorrect = answers[key]?.isCorrect;
        const hasValue = value.trim() !== "";
        const inputClass = hasValue
            ? isCorrect
                ? "autosize-input correct"
                : "autosize-input incorrect"
            : "autosize-input";

        return (
            <ExpandingInput
                type="text"
                className={inputClass}
                value={value}
                placeholder={row.placeholders?.[blankIndex] ?? ""}
                onChange={(event) =>
                    handleChange(itemIndex, blankIndex, event.target.value, correctAnswer)
                }
                minWidth={120}
                mobileMinWidth={75}
                tabletMinWidth={95}
                maxWidth={260}
                aria-label={`Substantivierte Adjektive blank ${blankIndex + 1}`}
                enableHint
                hintValue={correctAnswer}
            />
        );
    };

    return (
        <div className="exercise-inner">
            {showHint && (
                <ModalHtml images={slides} initialIndex={0} onClose={closeTheory} />
            )}

            <div className="scroll-container">
                <ProgressiveList items={items} className="list">
                    {(row, itemIndex) => {
                        const parts = String(row.sentence ?? "").split(BLANK_PATTERN);
                        const answersCount = Array.isArray(row.answers) ? row.answers.length : 0;

                        return (
                            <li key={itemIndex} className="list-item">
                                {parts.map((part, partIndex) => (
                                    <span key={partIndex}>
                                        {part}
                                        {partIndex < answersCount
                                            ? renderInput(row, itemIndex, partIndex)
                                            : null}
                                    </span>
                                ))}
                            </li>
                        );
                    }}
                </ProgressiveList>
            </div>
        </div>
    );
}

SubstantivierteAdjektive.hasHint = true;

SubstantivierteAdjektive.instructions = data.instructions;
SubstantivierteAdjektive.title = data.title;
