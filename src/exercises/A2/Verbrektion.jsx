import { useMemo } from "react";
import ModalHtml from "../../components/ModalHtml";
import ExpandingInput from "../../components/ExpandingInput";
import ProgressiveList from "../../components/ProgressiveList";
import { useLocale } from "../../contexts/LocaleContext";
import { useTheoryModal } from "../../contexts/TheoryModalContext";
import { usePersistentAnswers } from "../../hooks/usePersistentAnswers";

import data from "../../../data/A2/verbrektion.json";
import slide1Ru from "../../../data/A2/images/verbrektion1.html?raw";
import slide2Ru from "../../../data/A2/images/verbrektion2.html?raw";
import slide1En from "../../../data/A2/images/en/verbrektion1.html?raw";
import slide2En from "../../../data/A2/images/en/verbrektion2.html?raw";

import "../../css/exercises/Common.css";
import { normalizeAnswer } from "../../utils/answerUtils";

const STORAGE_KEY = "verbrektion-answers";

function normalizeItems(rawItems) {
    if (Array.isArray(rawItems) && rawItems.length > 0 && Array.isArray(rawItems[0])) {
        return rawItems.flat();
    }
    return Array.isArray(rawItems) ? rawItems : [];
}

function normalize(value) {
    return normalizeAnswer(value);
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
    const { isTheoryOpen: showHint, closeTheory } = useTheoryModal();

    const slides = useMemo(
        () =>
            locale === "en"
                ? [slide1En, slide2En]
                : [slide1Ru, slide2Ru],
        [locale]
    );
    const items = useMemo(() => normalizeItems(data.items), []);


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
                <ModalHtml images={slides} initialIndex={0} onClose={closeTheory} />
            )}

            <div className="scroll-container">
                <ProgressiveList items={items} className="list">
                    {(item, itemIdx) => {
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
                                                    enableHint={true}
                                                    hintValue={correctAnswer}
                                                    aria-label={`Verbrektion blank ${partIdx + 1} (item ${itemIdx + 1})`}
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

Verbrektion.hasHint = true;

Verbrektion.instructions = data.instructions;
Verbrektion.title = data.title;
