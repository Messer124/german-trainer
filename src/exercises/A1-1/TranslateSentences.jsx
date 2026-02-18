import { Eye } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { useLocale } from "../../contexts/LocaleContext";
import ExpandingInput from "../../components/ExpandingInput";
import data from "../../../data/A1-1/translate-sentences.json";
import "../../css/exercises/Common.css";
import { usePersistentAnswers } from "../../hooks/usePersistentAnswers";

const STORAGE_KEY = "translate-sentences-answers";

function TranslateSentences() {
    const { locale } = useLocale();
    const [answers, setAnswers] = usePersistentAnswers(STORAGE_KEY, {});
    const [previewValues, setPreviewValues] = useState({});
    const previewTimersRef = useRef({});

    useEffect(() => {
        return () => {
            Object.values(previewTimersRef.current).forEach((id) => clearTimeout(id));
        };
    }, []);

    const handleChange = (index, value) => {
        const correct = data.items[index].answer.trim().toLowerCase();
        const isCorrect = value.trim().toLowerCase() === correct;
        const key = `translate-${index}`;

        if (previewTimersRef.current[key]) {
            clearTimeout(previewTimersRef.current[key]);
            delete previewTimersRef.current[key];
        }
        if (previewValues[key] != null) {
            setPreviewValues((prev) => {
                const next = { ...prev };
                delete next[key];
                return next;
            });
        }

        setAnswers((prev) => ({
            ...prev,
            [key]: {
                value,
                isCorrect
            }
        }));
    };

    const showAnswerPreview = (index) => {
        const key = `translate-${index}`;
        const answer = String(data.items[index]?.answer ?? "");
        if (!answer) return;

        if (previewTimersRef.current[key]) {
            clearTimeout(previewTimersRef.current[key]);
        }

        setPreviewValues((prev) => ({ ...prev, [key]: answer }));

        previewTimersRef.current[key] = setTimeout(() => {
            setPreviewValues((prev) => {
                const next = { ...prev };
                delete next[key];
                return next;
            });
            delete previewTimersRef.current[key];
        }, 2000);
    };

    return (
        <div className="exercise-inner">
            <div className="scroll-container">
                <ul className="list">
                    {data.items.map((item, index) => {
                        const key = `translate-${index}`;
                        const value = answers[key]?.value ?? "";
                        const visibleValue = previewValues[key] ?? value;
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
                                    value={visibleValue}
                                    onChange={(e) => handleChange(index, e.target.value)}
                                    readOnly={previewValues[key] != null}
                                    minWidth={140}
                                    maxWidth={760}
                                />
                                <button
                                    type="button"
                                    className="eye-container eye-container--button"
                                    onClick={() => showAnswerPreview(index)}
                                    aria-label={`Show answer for sentence ${index + 1}`}
                                >
                                    <span><Eye size={18} /></span>
                                </button>
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
