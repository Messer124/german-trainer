import { useState, useEffect } from "react";
import data from "../../../data/A1-1/weak-verb-conjugation.json";
import "../../css/exercises/Common.css";
import ModalImage from "../../components/ModalImage";
import weakVerbsImage from "../../../data/A1-1/images/weak-verbs-conj.png";
import { usePersistentAnswers } from "../../hooks/usePersistentAnswers";

const STORAGE_KEY = "weak-verb-conjugation-answers";

function WeakVerbConjugation() {
    const [showImage, setShowImage] = useState(false);
    const [answers, setAnswers] = usePersistentAnswers(STORAGE_KEY, {});

    useEffect(() => {
        const handleShowHint = () => {
            setShowImage(true);
        };

        document.addEventListener("show-hint", handleShowHint);
        return () => {
            document.removeEventListener("show-hint", handleShowHint);
        };
    }, []);

    const pronouns = ["ich", "du", "er/sie/es", "wir/sie/Sie", "ihr"];

    return (
        <div className="exercise-inner">

            {showImage && (
                <ModalImage
                    src={weakVerbsImage}
                    alt="Hint"
                    onClose={() => setShowImage(false)}
                />
            )}

            <div className="table-wrapper">
                <table className="table">
                    <thead>
                    <tr>
                        <th>Infinitiv</th>
                        {pronouns.map((p) => (
                            <th key={p}>{p}</th>
                        ))}
                    </tr>
                    </thead>
                    <tbody>
                    {data.items.map((verb, index) => (
                        <tr key={index}>
                            <td>{verb.infinitive}</td>
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
                                            className={`table-input ${!answers[inputKey] || answers[inputKey].value === ""
                                                    ? ""
                                                    : isCorrect
                                                        ? "correct"
                                                        : "incorrect"
                                            }`}
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
        onClick={() => document.dispatchEvent(new CustomEvent("show-hint"))}
        className="hint-button"
    >
        !
    </button>
);

WeakVerbConjugation.instructions = data.instructions;
WeakVerbConjugation.title = data.title;
export default WeakVerbConjugation;