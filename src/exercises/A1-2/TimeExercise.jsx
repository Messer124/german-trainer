import { useEffect, useState } from "react";
import { Eye } from "lucide-react";
import ModalImage from "../../components/ModalImage";
import data from "../../../data/A1-2/time.json";
import timeImage from "../../../data/A1-2/images/timeRules.png";
import "../../css/exercises/Common.css";
import { usePersistentAnswers } from "../../hooks/usePersistentAnswers";

const STORAGE_KEY = "time-answers";

function TimeExercise() {
  const [showImage, setShowImage] = useState(false);
  const [answers, setAnswers] = usePersistentAnswers(STORAGE_KEY, {});

  useEffect(() => {
    const handleShowHint = () => {
      setShowImage(true);
    };

    document.addEventListener("show-hint", handleShowHint);
    return () => {
      document.removeEventListener("show-hint", handleShowHint);
    };
  }, []);

  const handleChange = (index, value) => {
    const correct = data.items[index].answer.trim().toLowerCase();
    const isCorrect = value.trim().toLowerCase() === correct;

    setAnswers((prev) => ({
      ...prev,
      [index]: { value, isCorrect },
    }));
  };

  return (
      <div className="exercise-inner">
        {showImage && (
            <ModalImage
                src={timeImage}
                alt={"Hint"}
                onClose={() => setShowImage(false)}
            />
        )}
          <div className="scroll-container">
            <ul className="list">
              {data.items.map((item, index) => {
                const stored = answers[index];
                const value = stored?.value || "";
                const trimmed = value.trim();
                const isCorrect = stored?.isCorrect;

                let inputClass = "autosize-input";
                if (trimmed !== "") {
                  inputClass += isCorrect ? " correct" : " incorrect";
                }

                // ширина считается на каждом рендере, как в KeinOrNicht
                const widthCh = Math.max(trimmed.length + 1, 6);

                return (
                    <li key={index}>
                      <span className="sentence">{item.time}</span>

                      <input
                          type="text"
                          className={inputClass}
                          value={value}
                          onChange={(e) => handleChange(index, e.target.value)}
                          style={{
                            width: `${widthCh}ch`,
                          }}
                      />

                      <span className="eye-container">
                                    <span>
                                        <Eye size={18} />
                                    </span>
                                    <span className="eye">{item.answer}</span>
                                </span>
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
