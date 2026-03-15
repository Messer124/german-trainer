import { useEffect, useState } from "react";
import ModalHtml from "../../components/ModalHtml";
import ExpandingInput from "../../components/ExpandingInput";
import { useLocale } from "../../contexts/LocaleContext";
import data from "../../../data/A1-2/time.json";
import hintRu from "../../../data/A1-2/images/timeRules.html?raw";
import hintEn from "../../../data/A1-2/images/en/timeRules.html?raw";
import "../../css/exercises/Common.css";
import { usePersistentAnswers } from "../../hooks/usePersistentAnswers";

const STORAGE_KEY = "time-answers";

function TimeExercise() {
  const { locale } = useLocale();
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
              <ModalHtml
                  html={locale === "en" ? hintEn : hintRu}
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

                return (
                    <li key={index}>
                      <span className="sentence">{item.time}</span>

                      <ExpandingInput
                          type="text"
                          className={inputClass}
                          value={value}
                          onChange={(e) => handleChange(index, e.target.value)}
                          minWidth={140}
                          maxWidth={460}
                          enableHint={true}
                          hintValue={item.answer}
                      />
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
