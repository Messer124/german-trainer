import { Eye } from "lucide-react";
import { useLocale } from "../../contexts/LocaleContext";
import data from "../../../data/A1-1/translate-sentences.json";
import "../../css/A1-1/TranslateSentences.css";
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
        <div className="translate-container">
            <ul className="translate-list">
                {data.items.map((item, index) => {
                    const key = `translate-${index}`;
                    const correct = item.answer.trim().toLowerCase();
                    const value = answers[key]?.value?.trim().toLowerCase() || "";
                    const isCorrect = value === correct;

                    return (
                        <li className="translate-item" key={index}>
                            <span className="translate-sentence">{item.sentence[locale]}</span>
                            <input
                                type="text"
                                className={`translate-input ${
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
                            <span className="tooltip-container">
                                <span> <Eye size={18}/> </span>
                                <span className="tooltip">{item.answer}</span>
                            </span>
                        </li>
                    );
                })}
            </ul>
        </div>
    );
}

TranslateSentences.instructions = data.instructions;
TranslateSentences.title = data.title;
export default TranslateSentences;