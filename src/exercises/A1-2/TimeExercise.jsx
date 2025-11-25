import { useEffect, useState } from "react";
import { Eye } from "lucide-react";
import { useLocale } from "../../contexts/LocaleContext";
import ModalImage from "../../components/ModalImage";
import data from "../../../data/A1-2/time.json";
import timeImage from "../../../data/A1-2/images/timeRules.png";
import "../../css/A1-2/TimeExercise.css";

function TimeExercise() {
  const STORAGE_KEY = "time-answers";
  const { locale } = useLocale();
  const [showImage, setShowImage] = useState(false);

  const [answers, setAnswers] = useState(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    try {
      return saved ? JSON.parse(saved) : {};
    } catch {
      return {};
    }
  });

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(answers));
  }, [answers]);

  useEffect(() => {
    const handleClear = () => {
      setAnswers({});
      localStorage.removeItem(STORAGE_KEY);
    };

    window.addEventListener("clear-time-answers", handleClear);
    return () => window.removeEventListener("clear-time-answers", handleClear);
  }, []);

  useEffect(() => {
    const handleShowHint = () => {
      setShowImage(true);
    };

    document.addEventListener("show-time-hint", handleShowHint);
    return () => {
      document.removeEventListener("show-time-hint", handleShowHint);
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
      <div className="time-container">
        {showImage && (
            <ModalImage
                src={timeImage}
                alt={
                  locale === "ru"
                      ? "Подсказка: как говорить время"
                      : "Hint: telling the time"
                }
                onClose={() => setShowImage(false)}
            />
        )}

        <ul className="time-list">
          {data.items.map((item, index) => {
            const stored = answers[index];
            const value = stored?.value || "";
            const trimmed = value.trim();
            const isCorrect = stored?.isCorrect;

            let inputClass = "time-input";
            if (trimmed !== "") {
              inputClass += isCorrect ? " correct" : " incorrect";
            }

            // ширина считается на каждом рендере, как в KeinOrNicht
            const widthCh = Math.max(trimmed.length + 1, 6);

            return (
                <li className="time-item" key={index}>
                  <span className="time-sentence">{item.time}</span>

                  <input
                      type="text"
                      className={inputClass}
                      value={value}
                      onChange={(e) => handleChange(index, e.target.value)}
                      style={{
                        width: `${widthCh}ch`,
                      }}
                  />

                  <span className="tooltip-container">
                                <span>
                                    <Eye size={18} />
                                </span>
                                <span className="tooltip">{item.answer}</span>
                            </span>
                </li>
            );
          })}
        </ul>
      </div>
  );
}

TimeExercise.headerButton = (
    <button
        onClick={() =>
            document.dispatchEvent(new CustomEvent("show-time-hint"))
        }
        className="hint-button"
    >
      !
    </button>
);

TimeExercise.instructions = data.instructions;
TimeExercise.title = data.title;

export default TimeExercise;
