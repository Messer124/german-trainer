import { useState, useEffect } from "react";
import data from "../../../data/A1-1/haben-sein.json";
import ModalImage from "../../components/ModalImage";
import hintImage from "../../../data/A1-1/images/haben-sein.png";
import "../../css/exercises/Common.css";
import { usePersistentAnswers } from "../../hooks/usePersistentAnswers";

const STORAGE_KEY = "haben-sein-answers";

function HabenOderSein() {
  const [answers, setAnswers] = usePersistentAnswers(STORAGE_KEY, {});
  const [showImage, setShowImage] = useState(false);

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
    setAnswers(prev => ({
      ...prev,
      [index]: {
        value,
        isCorrect: value.trim().toLowerCase() === correct
      }
    }));
  };

  return (
      <div className="exercise-inner">
        {showImage && (
            <ModalImage
                src={hintImage}
                onClose={() => setShowImage(false)}
            />
        )}
          <div className="scroll-container">
            <ul className="list">
              {data.items.map((item, index) => {
                const value = answers[index]?.value || "";
                const isCorrect = answers[index]?.isCorrect;
                const parts = item.sentence.split("___");

                return (
                    <li key={index}>
                      {parts[0]}
                      <input
                          type="text"
                          value={value}
                          onChange={(e) => handleChange(index, e.target.value)}
                          className={`input ${value === "" ? "" : isCorrect ? "correct" : "incorrect"}`}
                      />
                      {parts[1]}
                    </li>
                );
              })}
            </ul>
          </div>
      </div>
  );
}

HabenOderSein.headerButton = (
    <button
        onClick={() => document.dispatchEvent(new CustomEvent("show-hint"))}
        className="hint-button"
    >
        !
    </button>
);

HabenOderSein.instructions = data.instructions;
HabenOderSein.title = data.title;
export default HabenOderSein;