import { useTheoryModal } from "../../contexts/TheoryModalContext";
import data from "../../../data/A1-1/strong-verb-conjugation.json";
import "../../css/exercises/Common.css";
import ModalHtml from "../../components/ModalHtml";
import ExpandingInput from "../../components/ExpandingInput";
import hint from "../../../data/A1-1/images/strong-verbs-conj.html?raw";
import { usePersistentAnswers } from "../../hooks/usePersistentAnswers";

const STORAGE_KEY = "irregular-verbs-answers";

function StrongVerbsConjugation() {
  const { isTheoryOpen: showImage, closeTheory } = useTheoryModal();
  const [answers, setAnswers] = usePersistentAnswers(STORAGE_KEY, {});


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
              <th>ich</th>
              <th>du</th>
              <th>er/sie/es</th>
              <th>wir/Sie/sie</th>
              <th>ihr</th>
            </tr>
            </thead>
            <tbody>
            {data.items.map((item, index) => (
                <tr key={index}>
                  {["ich", "du", "er/sie/es", "wir/Sie/sie", "ihr"].map((pronoun) => {
                    const inputKey = `irregular-verbs-${index}-${pronoun}`;
                    const correct = item.answers[pronoun]?.toLowerCase();
                    const userInput = answers[inputKey]?.value?.trim().toLowerCase() || "";
                    const isCorrect = userInput === correct;

                    return (
                        <td key={pronoun}>
                          <ExpandingInput
                              type="text"
                              value={answers[inputKey]?.value || ""}
                              placeholder={item.sentence}
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

StrongVerbsConjugation.hasHint = true;

StrongVerbsConjugation.instructions = data.instructions;
StrongVerbsConjugation.title = data.title;
export default StrongVerbsConjugation;
