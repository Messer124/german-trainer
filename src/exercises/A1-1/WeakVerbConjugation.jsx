import { useTheoryModal } from "../../contexts/TheoryModalContext";
import data from "../../../data/A1-1/weak-verb-conjugation.json";
import "../../css/exercises/Common.css";
import ModalHtml from "../../components/ModalHtml";
import ExpandingInput from "../../components/ExpandingInput";
import hint from "../../../data/A1-1/images/weak-verbs-conj.html?raw";
import { usePersistentAnswers } from "../../hooks/usePersistentAnswers";

const STORAGE_KEY = "weak-verb-conjugation-answers";

function WeakVerbConjugation() {
    const { isTheoryOpen: showImage, closeTheory } = useTheoryModal();
    const [answers, setAnswers] = usePersistentAnswers(STORAGE_KEY, {});


    const pronouns = ["ich", "du", "er/sie/es", "wir/sie/Sie", "ihr"];

    return (
        <div className="exercise-inner">
            {showImage && (
                <ModalHtml
                    html={hint}
                    onClose={closeTheory}
                />
            )}

            <div className="table-wrapper">
                <table className="table">
                    <thead>
                    <tr>
                        {pronouns.map((p) => (
                            <th key={p}>{p}</th>
                        ))}
                    </tr>
                    </thead>
                    <tbody>
                    {data.items.map((verb, index) => (
                        <tr key={index}>
                            {pronouns.map((pronoun) => {
                                const inputKey = `weak-verbs-${index}-${pronoun}`;
                                const correct = verb.conjugation[pronoun]?.toLowerCase();
                                const userInput = answers[inputKey]?.value?.trim().toLowerCase() || "";
                                const isCorrect = userInput === correct;

                                return (
                                    <td key={pronoun}>
                                        <ExpandingInput
                                            type="text"
                                            value={answers[inputKey]?.value || ""}
                                            placeholder={verb.infinitive}
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
                                            minWidth={200}
                                            maxWidth={240}
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

WeakVerbConjugation.hasHint = true;

WeakVerbConjugation.instructions = data.instructions;
WeakVerbConjugation.title = data.title;
export default WeakVerbConjugation;
