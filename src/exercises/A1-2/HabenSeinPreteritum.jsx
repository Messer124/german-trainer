import { useEffect, useState } from "react";
import ModalHtml from "../../components/ModalHtml";
import ExpandingInput from "../../components/ExpandingInput";
import { usePersistentAnswers } from "../../hooks/usePersistentAnswers";
import data from "../../../data/A1-2/habenSeinPreteritum.json";
import hint from "../../../data/A1-2/images/habenSeinPreteritum.html?raw";
import "../../css/exercises/Common.css";

const STORAGE_KEY = "haben-sein-preteritum-answers";

function HabenSeinPreteritum() {

  const [answers, setAnswers] = usePersistentAnswers(STORAGE_KEY, {});

  const [showImage, setShowImage] = useState(false);

  useEffect(() => {
    const handleShowHint = () => {
      setShowImage(true);
    };

    document.addEventListener(
        "show-hint",
        handleShowHint
    );
    return () => {
      document.removeEventListener(
          "show-hint",
          handleShowHint
      );
    };
  }, []);

  const handleChange = (index, value) => {
    const correct =
        data.items[index].answer.trim().toLowerCase();

    setAnswers((prev) => ({
      ...prev,
      [index]: {
        value,
        isCorrect: value.trim().toLowerCase() === correct,
      },
    }));
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
                const value = answers[index]?.value || "";
                const isCorrect = answers[index]?.isCorrect;

                const parts = item.sentence.split("___");

                return (
                    <li key={index}>
                      {parts[0]}
                      <ExpandingInput
                          type="text"
                          value={value}
                          onChange={(e) => handleChange(index, e.target.value)}
                          className={`input ${
                              value === ""
                                  ? ""
                                  : isCorrect
                                      ? "correct"
                                      : "incorrect"
                          }`}
                          minWidth={110}
                          maxWidth={240}
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

HabenSeinPreteritum.headerButton = (
    <button
        onClick={() =>
            document.dispatchEvent(
                new CustomEvent("show-hint")
            )
        }
        className="hint-button"
    >
      !
    </button>
);

HabenSeinPreteritum.instructions = data.instructions;
HabenSeinPreteritum.title = data.title;

export default HabenSeinPreteritum;
