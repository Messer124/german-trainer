import { Eye } from "lucide-react";
import { useLocale } from "../../contexts/LocaleContext";
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
                        const correct = item.answer.trim().toLowerCase();
                        const value = answers[key]?.value?.trim().toLowerCase() || "";
                        const isCorrect = value === correct;

                        return (
                            <li key={index}>
                                <span className="sentence">{item.sentence[locale]}</span>
                                <input
                                    type="text"
                                    className={`autosize-input ${
                                        !answers[key] || answers[key].value === ""
                                            ? ""
                                            : isCorrect
                                                ? "correct"
                                                : "incorrect"
                                    }`}
                                    value={answers[key]?.value || ""}
                                    onChange={(e) => handleChange(index, e.target.value)}
                                    style={{
                                        width: `${Math.max(value.length + 1, 6)}ch`
                                    }}
                                />
                                <span className="eye-container">
                                <span> <Eye size={18}/> </span>
                                <span className="eye">{item.answer}</span>
                            </span>
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