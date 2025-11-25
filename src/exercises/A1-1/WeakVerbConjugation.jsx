import { useState, useEffect } from "react";
import { useLocale } from "../../contexts/LocaleContext";
import data from "../../../data/A1-1/weak-verb-conjugation.json";
import "../../css/A1-1/WeakVerbConjugation.css";
import ModalImage from "../../components/ModalImage";
import weakVerbsImage from "../../../data/A1-1/images/weak-verbs-conj.png";

function WeakVerbConjugation() {
    const STORAGE_KEY = "weak-verb-conjugation-answers";
    const { locale } = useLocale();
    const [showImage, setShowImage] = useState(false);

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

    useEffect(() => {
        const handleShowHint = () => {
            setShowImage(true);
        };

        document.addEventListener("show-weakVerbConjugation-hint", handleShowHint);
        return () => {
            document.removeEventListener("show-weakVerbConjugation-hint", handleShowHint);
        };
    }, []);

    const pronouns = ["ich", "du", "er/sie/es", "wir/sie/Sie", "ihr"];

    return (
        <div>

            {showImage && (
                <ModalImage
                    src={weakVerbsImage}
                    alt="Weak verb chart"
                    onClose={() => setShowImage(false)}
                />
            )}

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

WeakVerbConjugation.headerButton = (
    <button
        onClick={() => document.dispatchEvent(new CustomEvent("show-weakVerbConjugation-hint"))}
        className="hint-button"
    >
        !
    </button>
);

WeakVerbConjugation.instructions = data.instructions;
WeakVerbConjugation.title = data.title;
export default WeakVerbConjugation;