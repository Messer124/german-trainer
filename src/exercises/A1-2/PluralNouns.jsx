import { useEffect, useState } from "react";
import { Eye } from "lucide-react";
import ModalHtml from "../../components/ModalHtml";
import { usePersistentAnswers } from "../../hooks/usePersistentAnswers";
import data from "../../../data/A1-2/pluralNouns.json";
import "../../css/exercises/Common.css";
import hint1 from "../../../data/A1-2/images/pluralNouns1.html?raw";
import hint2 from "../../../data/A1-2/images/pluralNouns2.html?raw";

const STORAGE_KEY = "plural-nouns-answers";

function PluralNounsExercise() {
  const [answers, setAnswers] = usePersistentAnswers(STORAGE_KEY, {});
  const [showHint, setShowHint] = useState(false);
  const hintSlides = [hint1, hint2];

  useEffect(() => {
    const handleShowHint = () => setShowHint(true);

    document.addEventListener("show-hint", handleShowHint);
    return () => document.removeEventListener("show-hint", handleShowHint);
  }, []);

  const handleChange = (index, value) => {
    const correct = data.items[index].plural.trim().toLowerCase();
    const isCorrect = value.trim().toLowerCase() === correct;

    setAnswers((prev) => ({
      ...prev,
      [index]: { value, isCorrect },
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

        <div className="scroll-container">
          <ul className="list">
            {data.items.map((item, index) => {
              const stored = answers[index];
              const value = stored?.value || "";
              const trimmed = value.trim();
              const isCorrect = stored?.isCorrect;

              let inputClass = "input";
              if (trimmed !== "") {
                inputClass += isCorrect ? " correct" : " incorrect";
              }

              const widthCh = Math.max(trimmed.length + 1, 6);

              return (
                  <li key={index}>
                    <span className="plural-singular">{item.word} — die</span>

                    <input
                        type="text"
                        className={inputClass}
                        value={value}
                        onChange={(e) => handleChange(index, e.target.value)}
                        style={{ width: `${widthCh}ch` }}
                    />

                    <span className="eye-container">
                  <span>
                    <Eye size={18} />
                  </span>
                  <span className="eye">{item.plural}</span>
                </span>
                  </li>
              );
            })}
          </ul>
        </div>
      </div>
  );
}

PluralNounsExercise.headerButton = (
    <button
        type="button"
        onClick={() =>
            document.dispatchEvent(new CustomEvent("show-hint"))
        }
        className="hint-button"
    >
      !
    </button>
);

PluralNounsExercise.instructions = data.instructions;
PluralNounsExercise.title = data.title;

export default PluralNounsExercise;
