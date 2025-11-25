import { useState, useEffect } from "react";
import { useLocale } from "../../contexts/LocaleContext";
import data from "../../../data/A1-1/strong-verb-conjugation.json";
import "../../css/A1-1/StrongVerbsConjugation.css";
import ModalImage from "../../components/ModalImage";
import strongVerbsImage from "../../../data/A1-1/images/strong-verbs-conj.png";

function StrongVerbsConjugation() {
  const { locale } = useLocale();
  const [showImage, setShowImage] = useState(false);
  const [answers, setAnswers] = useState(() => {
    const saved = localStorage.getItem("irregular-answers");
    return saved ? JSON.parse(saved) : {};
  });

  useEffect(() => {
    localStorage.setItem("irregular-answers", JSON.stringify(answers));
  }, [answers]);

  useEffect(() => {
    const handleClear = () => setAnswers({});
    window.addEventListener("clear-irregular-answers", handleClear);
    return () => window.removeEventListener("clear-irregular-answers", handleClear);
  }, []);

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