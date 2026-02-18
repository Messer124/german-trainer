import { useEffect, useRef, useState } from "react";
import { Eye } from "lucide-react";
import ModalHtml from "../../components/ModalHtml";
import ExpandingInput from "../../components/ExpandingInput";
import { useLocale } from "../../contexts/LocaleContext";
import { usePersistentAnswers } from "../../hooks/usePersistentAnswers";
import data from "../../../data/A1-2/pluralNouns.json";
import "../../css/exercises/Common.css";
import hint1Ru from "../../../data/A1-2/images/pluralNouns1.html?raw";
import hint2Ru from "../../../data/A1-2/images/pluralNouns2.html?raw";
import hint1En from "../../../data/A1-2/images/en/pluralNouns1.html?raw";
import hint2En from "../../../data/A1-2/images/en/pluralNouns2.html?raw";

const STORAGE_KEY = "plural-nouns-answers";

function PluralNounsExercise() {
  const { locale } = useLocale();
  const [answers, setAnswers] = usePersistentAnswers(STORAGE_KEY, {});
  const [showHint, setShowHint] = useState(false);
  const [previewValues, setPreviewValues] = useState({});
  const previewTimersRef = useRef({});
  const hintSlides = locale === "en" ? [hint1En, hint2En] : [hint1Ru, hint2Ru];

  useEffect(() => {
    const handleShowHint = () => setShowHint(true);

    document.addEventListener("show-hint", handleShowHint);
    return () => document.removeEventListener("show-hint", handleShowHint);
  }, []);

  useEffect(() => {
    return () => {
      Object.values(previewTimersRef.current).forEach((id) => clearTimeout(id));
    };
  }, []);

  const handleChange = (index, value) => {
    const correct = data.items[index].plural.trim().toLowerCase();
    const isCorrect = value.trim().toLowerCase() === correct;

    if (previewTimersRef.current[index]) {
      clearTimeout(previewTimersRef.current[index]);
      delete previewTimersRef.current[index];
    }
    if (previewValues[index] != null) {
      setPreviewValues((prev) => {
        const next = { ...prev };
        delete next[index];
        return next;
      });
    }

    setAnswers((prev) => ({
      ...prev,
      [index]: { value, isCorrect },
    }));
  };

  const showAnswerPreview = (index) => {
    const answer = String(data.items[index]?.plural ?? "");
    if (!answer) return;

    if (previewTimersRef.current[index]) {
      clearTimeout(previewTimersRef.current[index]);
    }

    setPreviewValues((prev) => ({ ...prev, [index]: answer }));

    previewTimersRef.current[index] = setTimeout(() => {
      setPreviewValues((prev) => {
        const next = { ...prev };
        delete next[index];
        return next;
      });
      delete previewTimersRef.current[index];
    }, 2000);
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
              const visibleValue = previewValues[index] ?? value;
              const trimmed = visibleValue.trim();
              const isCorrect = stored?.isCorrect;

              let inputClass = "input";
              if (trimmed !== "") {
                inputClass += isCorrect ? " correct" : " incorrect";
              }

              return (
                  <li key={index}>
                    <span className="plural-singular">{item.word} — die</span>

                    <ExpandingInput
                        type="text"
                        className={inputClass}
                        value={visibleValue}
                        onChange={(e) => handleChange(index, e.target.value)}
                        readOnly={previewValues[index] != null}
                        minWidth={120}
                        maxWidth={420}
                    />

                    <button
                        type="button"
                        className="eye-container eye-container--button"
                        onClick={() => showAnswerPreview(index)}
                        aria-label={`Show answer for item ${index + 1}`}
                    >
                      <span>
                        <Eye size={18} />
                      </span>
                    </button>
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
