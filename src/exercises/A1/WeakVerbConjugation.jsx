import { useState, useEffect } from "react";
import { useLocale } from "../../contexts/LocaleContext";
import data from "../../../data/A1/weak-verb-conjugation.json";
import "../../css/A1/WeakVerbConjugation.css";

function WeakVerbConjugation() {
    const STORAGE_KEY = "weak-verb-conjugation-answers";
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
        const handleClear = () => setAnswers({});
        window.addEventListener("clear-verb-conjugation", handleClear);
        return () => window.removeEventListener("clear-verb-conjugation", handleClear);
    }, []);

    const pronouns = ["ich", "du", "er/sie/es", "wir/sie/Sie", "ihr"];

    return (
        <div>
            <div className="weak-table-wrapper">
                <table className="weak-verb-table">
                    <thead>
                    <tr>
                        <th className="infinitive">Infinitiv</th>
                        {pronouns.map((p) => (
                            <th key={p}>{p}</th>
                        ))}
                    </tr>
                    </thead>
                    <tbody>
                    {data.items.map((verb, index) => (
                        <tr key={index}>
                            <td className="infinitive">{verb.infinitive}</td>
                            {pronouns.map((pronoun) => {
                                const inputKey = `weak-verbs-${index}-${pronoun}`;
                                const correct = verb.conjugation[pronoun]?.toLowerCase();
                                const userInput = answers[inputKey]?.value?.trim().toLowerCase() || "";
                                const isCorrect = userInput === correct;

                                return (
                                    <td key={pronoun}>
                                        <input
                                            type="text"
                                            value={answers[inputKey]?.value || ""}
                                            onChange={(e) =>
                                                setAnswers((prev) => ({
                                                    ...prev,
                                                    [inputKey]: {
                                                        value: e.target.value,
                                                        isCorrect: e.target.value.trim().toLowerCase() === correct
                                                    }
                                                }))
                                            }
                                            className={
                                                !answers[inputKey] || answers[inputKey].value === ""
                                                    ? ""
                                                    : isCorrect
                                                        ? "correct"
                                                        : "incorrect"
                                            }
                                        />
                                    </td>
                                );
                            })}
                        </tr>
                    ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}

WeakVerbConjugation.instructions = data.instructions;
WeakVerbConjugation.title = data.title;
export default WeakVerbConjugation;