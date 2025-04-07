import { useState, useEffect } from "react";
import { useLocale } from "../../contexts/LocaleContext";
import strongVerbs from "../../../data/A1/strong-verb-conjugation.json";
import "../../css/A1/StrongVerbsConjugation.css";

export default function StrongVerbsConjugation() {
  const { locale } = useLocale();

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

  return (
      <div>
        <div className="strong-header-wrapper">
          <h2 className="strong-header-title">{strongVerbs.title[locale]}</h2>
          <p className="strong-header-subtitle">{strongVerbs.instructions[locale]}</p>
        </div>

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
            {strongVerbs.items.map((item, index) => (
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
