import { useState, useEffect } from "react";
import ModalHtml from "../../components/ModalHtml";
import data from "../../../data/A1-2/irregular verbs.json";
import "../../css/exercises/Common.css";
import hint1 from "../../../data/A1-2/images/preteritum.html?raw";
import hint2 from "../../../data/A1-2/images/partizip2.html?raw";
import { Eye } from "lucide-react";
import { usePersistentAnswers } from "../../hooks/usePersistentAnswers";

const STORAGE_KEY = "verbs-preteritum-perfekt-answers";

function VerbsPreteritumPerfekt() {
  const [answers, setAnswers] = usePersistentAnswers(STORAGE_KEY, {});

  const [showHint, setShowHint] = useState(false);
  const hintSlides = [hint1, hint2];

  useEffect(() => {
    const handleShowHint = () => setShowHint(true);

    document.addEventListener("show-hint", handleShowHint);
    return () => document.removeEventListener("show-hint", handleShowHint);
  }, []);

  const closeGallery = () => setCurrentSlide(null);

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
      <div className="exercise-inner">
        {showHint && (
            <ModalHtml
                images={hintSlides}
                initialIndex={0}
                onClose={() => setShowHint(false)}
            />
        )}

        <div className="table-wrapper">
          <table className="table">
            <thead>
            <tr>
              <th>Präteritum</th>
              <th>Partizip II</th>
            </tr>
            </thead>
            <tbody>
            {data.items.map((item, rowIndex) => (
                <tr key={rowIndex}>
                  {["praeteritum", "perfekt"].map((field) => {
                    const inputKey = `verbs-pp-${rowIndex}-${field}`;
                    const correct = item[field].trim().toLowerCase();
                    const stored = answers[inputKey];
                    const value = stored?.value || "";
                    const trimmed = value.trim().toLowerCase();
                    const isCorrect = trimmed === correct;

                    return (
                        <td key={field}>
                          <div>
                            <input
                                type="text"
                                value={value}
                                onChange={(e) =>
                                    handleChange(rowIndex, field, e.target.value)
                                }
                                className={`table-input ${
                                    value.trim() === ""
                                        ? ""
                                        : isCorrect
                                            ? "correct"
                                            : "incorrect"
                                }`}
                                placeholder={item.infinitive}
                            />

                            <span className="eye-container">
                          <span>
                            <Eye size={18} />
                          </span>
                          <span className="eye">{item[field]}</span>
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
            document.dispatchEvent(new CustomEvent("show-hint"))
        }
        className="hint-button"
    >
      !
    </button>
);

VerbsPreteritumPerfekt.instructions = data.instructions;
VerbsPreteritumPerfekt.title = data.title;

export default VerbsPreteritumPerfekt;
