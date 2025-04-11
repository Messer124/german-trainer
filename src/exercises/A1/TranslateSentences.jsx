import { useEffect, useState } from "react";
import { useLocale } from "../../contexts/LocaleContext";
import data from "../../../data/A1/translate-sentences.json";
import "../../css/A1/TranslateSentences.css";

function TranslateSentences() {
    const STORAGE_KEY = "translate-sentences";
    const { locale } = useLocale();

    const [answers, setAnswers] = useState(() => {
        const saved = localStorage.getItem(STORAGE_KEY);
        try {
            return saved ? JSON.parse(saved) : {};
        } catch {
            return {};
        }
    });

    useEffect(() => {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(answers));
    }, [answers]);

    useEffect(() => {
        const handleClear = () => {
            setAnswers({});
            localStorage.removeItem(STORAGE_KEY);
        };
        window.addEventListener("clear-translate-sentences", handleClear);
        return () => window.removeEventListener("clear-translate-sentences", handleClear);
    }, []);

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
                <span role="img" className="eye-icon">👁️‍🗨️️</span>
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