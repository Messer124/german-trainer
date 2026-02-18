import { useEffect, useRef, useState } from "react";
import { Eye } from "lucide-react";
import ModalHtml from "../../components/ModalHtml";
import ExpandingInput from "../../components/ExpandingInput";
import data from "../../../data/A1-2/time.json";
import hint from "../../../data/A1-2/images/timeRules.html?raw";
import "../../css/exercises/Common.css";
import { usePersistentAnswers } from "../../hooks/usePersistentAnswers";

const STORAGE_KEY = "time-answers";

function TimeExercise() {
  const [showImage, setShowImage] = useState(false);
  const [answers, setAnswers] = usePersistentAnswers(STORAGE_KEY, {});
  const [previewValues, setPreviewValues] = useState({});
  const previewTimersRef = useRef({});

  useEffect(() => {
    const handleShowHint = () => {
      setShowImage(true);
    };

    document.addEventListener("show-hint", handleShowHint);
    return () => {
      document.removeEventListener("show-hint", handleShowHint);
    };
  }, []);

  useEffect(() => {
    return () => {
      Object.values(previewTimersRef.current).forEach((id) => clearTimeout(id));
    };
  }, []);

  const handleChange = (index, value) => {
    const correct = data.items[index].answer.trim().toLowerCase();
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
    const answer = String(data.items[index]?.answer ?? "");
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
          {showImage && (
              <ModalHtml
                  html={hint}
                  onClose={() => setShowImage(false)}
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

                let inputClass = "autosize-input";
                if (trimmed !== "") {
                  inputClass += isCorrect ? " correct" : " incorrect";
                }

                return (
                    <li key={index}>
                      <span className="sentence">{item.time}</span>

                      <ExpandingInput
                          type="text"
                          className={inputClass}
                          value={visibleValue}
                          onChange={(e) => handleChange(index, e.target.value)}
                          readOnly={previewValues[index] != null}
                          minWidth={140}
                          maxWidth={460}
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

TimeExercise.headerButton = (
    <button
        onClick={() =>
            document.dispatchEvent(new CustomEvent("show-hint"))
        }
        className="hint-button"
    >
      !
    </button>
);

TimeExercise.instructions = data.instructions;
TimeExercise.title = data.title;

export default TimeExercise;
