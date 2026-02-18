import { useEffect, useState } from "react";
import ModalHtml from "../../components/ModalHtml";
import ExpandingInput from "../../components/ExpandingInput";
import { usePersistentAnswers } from "../../hooks/usePersistentAnswers";
import data from "../../../data/A1-2/modalVerbsPreteritum.json";
import hint from "../../../data/A1-2/images/modalVersPreteritum.html?raw"
import "../../css/exercises/Common.css";

const STORAGE_KEY = "modal-verbs-preteritum-answers";

function ModalVerbsPreteritum() {
  const [answers, setAnswers] = usePersistentAnswers(STORAGE_KEY, {});
  const [showImage, setShowImage] = useState(false);

  useEffect(() => {
    const handleShowHint = () => setShowImage(true);

    document.addEventListener("show-hint", handleShowHint);
    return () => {
      document.removeEventListener("show-hint", handleShowHint);
    };
  }, []);

  const handleChange = (index, value) => {
    const correct =
        data.items[index].answer.trim().toLowerCase();
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
                  html={hint}
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

                const parts = item.sentence.split("___");

                const inputClass =
                    trimmed === ""
                        ? "input "
                        : isCorrect
                            ? "input correct"
                            : "input incorrect";

                return (
                    <li key={index}>
                      {parts[0]}
                      <ExpandingInput
                          type="text"
                          value={value}
                          onChange={(e) => handleChange(index, e.target.value)}
                          className={inputClass}
                          placeholder={item.verb}
                          minWidth={120}
                          maxWidth={260}
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

ModalVerbsPreteritum.headerButton = (
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

ModalVerbsPreteritum.instructions = data.instructions;
ModalVerbsPreteritum.title = data.title;

export default ModalVerbsPreteritum;
