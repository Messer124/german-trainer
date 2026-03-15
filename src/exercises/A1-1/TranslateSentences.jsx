import { useState } from "react";
import { useLocale } from "../../contexts/LocaleContext";
import ExpandingInput from "../../components/ExpandingInput";
import data from "../../../data/A1-1/translate-sentences.json";
import "../../css/exercises/Common.css";
import { usePersistentAnswers } from "../../hooks/usePersistentAnswers";

const STORAGE_KEY = "translate-sentences-answers";

function TranslateSentences() {
    const { locale } = useLocale();
    const [answers, setAnswers] = usePersistentAnswers(STORAGE_KEY, {});

    const handleChange = (index, value) => {
        const correct = data.items[index].answer.trim().toLowerCase();
        const isCorrect = value.trim().toLowerCase() === correct;
        const key = `translate-${index}`;

        setAnswers((prev) => ({
            ...prev,
            [key]: {
                value,
                isCorrect
            }
        }));
    };

    return (
        <div className="exercise-inner">
            <div className="scroll-container">
                <ul className="list">
                    {data.items.map((item, index) => {
                        const key = `translate-${index}`;
                        const value = answers[key]?.value ?? "";
                        const isCorrect = answers[key]?.isCorrect;

                        return (
                            <li key={index}>
                                <span className="sentence">{item.sentence[locale]}</span>
                                <ExpandingInput
                                    type="text"
                                    className={`autosize-input ${
                                        !answers[key] || answers[key].value === ""
                                            ? ""
                                            : isCorrect
                                                ? "correct"
                                                : "incorrect"
                                    }`}
                                    value={value}
                                    onChange={(e) => handleChange(index, e.target.value)}
                                    minWidth={140}
                                    maxWidth={760}
                                    enableHint={true}
                                    hintValue={item.answer}
                                />
                            </li>
                        );
                    })}
                </ul>
            </div>
        </div>
    );
}

TranslateSentences.instructions = data.instructions;
TranslateSentences.title = data.title;
export default TranslateSentences;
