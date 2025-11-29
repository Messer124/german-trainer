import { useState, useEffect } from "react";
import data from "../../../data/A1-1/strong-verb-conjugation.json";
import "../../css/A1-1/StrongVerbsConjugation.css";
import ModalImage from "../../components/ModalImage";
import strongVerbsImage from "../../../data/A1-1/images/strong-verbs-conj.png";
import { usePersistentAnswers } from "../../hooks/usePersistentAnswers";

const STORAGE_KEY = "irregular-verbs-answers";

function StrongVerbsConjugation() {
  const [showImage, setShowImage] = useState(false);
  const [answers, setAnswers] = usePersistentAnswers(STORAGE_KEY, {});

  useEffect(() => {
    const handleShowHint = () => {
      setShowImage(true);
    };

    document.addEventListener("show-strongVerbs-hint", handleShowHint);
    return () => {
      document.removeEventListener("show-strongVerbs-hint", handleShowHint);
    };
  }, []);

  return (
      <div>

        {showImage && (
            <ModalImage
                src={strongVerbsImage}
                alt="Strong verb chart"
                onClose={() => setShowImage(false)}
            />
        )}

        <div className="strong-table-wrapper">
          <table className="strong-table">
            <thead>
            <tr>
              <th className="infinitive">Infinitiv</th>
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
                  <td className="infinitive">{item.sentence}</td>
                  {["ich", "du", "er/sie/es", "wir/Sie/sie", "ihr"].map((pronoun) => {
                    const inputKey = `irregular-verbs-${index}-${pronoun}`;
                    const correct = item.answers[pronoun]?.toLowerCase();
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

StrongVerbsConjugation.headerButton = (
    <button
        onClick={() => document.dispatchEvent(new CustomEvent("show-strongVerbs-hint"))}
        className="hint-button"
    >
      !
    </button>
);

StrongVerbsConjugation.instructions = data.instructions;
StrongVerbsConjugation.title = data.title;
export default StrongVerbsConjugation;