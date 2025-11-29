import { useState, useEffect } from "react";
import { useLocale } from "../../contexts/LocaleContext";
import ModalImage from "../../components/ModalImage";
import data from "../../../data/A1-2/irregular verbs.json";
import "../../css/A1-1/StrongVerbsConjugation.css";
import modalImage from "../../../data/A1-2/images/preteritum.png";
import { Eye } from "lucide-react";
import { usePersistentAnswers } from "../../hooks/usePersistentAnswers";

const STORAGE_KEY = "verbs-preteritum-perfekt-answers";

function VerbsPreteritumPerfekt() {
  const { locale } = useLocale();
  const [showImage, setShowImage] = useState(false);
  const [answers, setAnswers] = usePersistentAnswers(STORAGE_KEY, {});

  useEffect(() => {
    const handleShowHint = () => {
      setShowImage(true);
    };

    document.addEventListener("show-verbs-preteritum-perfekt-hint", handleShowHint);
    return () => {
      document.removeEventListener("show-verbs-preteritum-perfekt-hint", handleShowHint);
    };
  }, []);

  const handleChange = (rowIndex, field, value) => {
    const correct = data.items[rowIndex][field].trim().toLowerCase();
    const isCorrect = value.trim().toLowerCase() === correct;
    const inputKey = `verbs-pp-${rowIndex}-${field}`;

    setAnswers((prev) => ({
      ...prev,
      [inputKey]: {
        value,
        isCorrect,
      },
    }));
  };

  return (
      <div>
        {showImage && (
            <ModalImage
                src={modalImage}
                alt={
                  locale === "ru"
                      ? "Подсказка по Präteritum и Perfekt"
                      : "Hint: Präteritum and Perfekt"
                }
                onClose={() => setShowImage(false)}
            />
        )}

        <div className="strong-table-wrapper">
          <table className="strong-table">
            <thead>
            <tr>
              <th className="infinitive">Infinitiv</th>
              <th>Präteritum</th>
              <th>Partizip II</th>
            </tr>
            </thead>
            <tbody>
            {data.items.map((item, rowIndex) => (
                <tr key={rowIndex}>
                  <td className="infinitive">{item.infinitive}</td>

                  {["praeteritum", "perfekt"].map((field) => {
                    const inputKey = `verbs-pp-${rowIndex}-${field}`;
                    const correct = item[field].trim().toLowerCase();
                    const stored = answers[inputKey];
                    const value = stored?.value || "";
                    const trimmed = value.trim().toLowerCase();
                    const isCorrect = trimmed === correct;

                    const className =
                        value.trim() === ""
                            ? ""
                            : isCorrect
                                ? "correct"
                                : "incorrect";

                    return (
                        <td key={field}>
                          <div className="verbs-input-wrapper">
                            <input
                                type="text"
                                value={value}
                                onChange={(e) => handleChange(rowIndex, field, e.target.value)}
                                className={className}
                            />

                            <span className="tooltip-container">
                              <span><Eye size={18}/></span>
                              <span className="tooltip">{item[field]}</span>
                            </span>
                          </div>
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

VerbsPreteritumPerfekt.headerButton = (
    <button
        onClick={() =>
            document.dispatchEvent(
                new CustomEvent("show-verbs-preteritum-perfekt-hint")
            )
        }
        className="hint-button"
    >
      !
    </button>
);

VerbsPreteritumPerfekt.instructions = data.instructions;
VerbsPreteritumPerfekt.title = data.title;

export default VerbsPreteritumPerfekt;