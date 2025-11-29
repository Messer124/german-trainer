import { useEffect, useState } from "react";
import { useLocale } from "../../contexts/LocaleContext";
import ModalImage from "../../components/ModalImage";

import data from "../../../data/A1-2/modalVerbsPreteritum.json";
import modalVerbsImage from "../../../data/A1-2/images/modalVersPreteritum.png";
import "../../css/A1-1/habenOderSein.css";

function ModalVerbsPreteritum() {
  const STORAGE_KEY = "modal-verbs-preteritum-answers";
  const { locale } = useLocale();

  const [answers, setAnswers] = useState(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    try {
      return saved ? JSON.parse(saved) : {};
    } catch {
      return {};
    }
  });

  const [showImage, setShowImage] = useState(false);

  // сохраняем ответы
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(answers));
  }, [answers]);

  useEffect(() => {
    const handleClear = () => {
      setAnswers({});
      localStorage.removeItem(STORAGE_KEY);
    };

    window.addEventListener("clear-modal-verbs-preteritum-answers", handleClear);
    return () => {
      window.removeEventListener("clear-modal-verbs-preteritum-answers", handleClear);
    };
  }, []);

  useEffect(() => {
    const handleShowHint = () => setShowImage(true);

    document.addEventListener("show-modal-verbs-preteritum-hint", handleShowHint);
    return () => {
      document.removeEventListener("show-modal-verbs-preteritum-hint", handleShowHint);
    };
  }, []);

  const handleChange = (index, value) => {
    const correct =
        data.items[0].items[index].answer.trim().toLowerCase();
    const isCorrect = value.trim().toLowerCase() === correct;

    setAnswers((prev) => ({
      ...prev,
      [index]: { value, isCorrect },
    }));
  };

  return (
      <div className="haben-container">
        {showImage && (
            <ModalImage
                src={modalVerbsImage}
                alt={
                  locale === "ru"
                      ? "Подсказка: модальные глаголы в Präteritum"
                      : "Hint: modal verbs in Präteritum"
                }
                onClose={() => setShowImage(false)}
            />
        )}

        <ul className="haben-list">
          {data.items[0].items.map((item, index) => {
            const stored = answers[index];
            const value = stored?.value || "";
            const trimmed = value.trim();
            const isCorrect = stored?.isCorrect;

            const parts = item.sentence.split("___");

            const inputClass =
                trimmed === ""
                    ? "haben-input"
                    : isCorrect
                        ? "haben-input correct"
                        : "haben-input incorrect";

            return (
                <li key={index} className="haben-item">
                  {parts[0]}
                  <input
                      type="text"
                      value={value}
                      onChange={(e) => handleChange(index, e.target.value)}
                      className={inputClass}
                      style={{
                        width: `${Math.max(trimmed.length + 1, 6)}ch`,
                      }}
                  />
                  {parts[1]}
                </li>
            );
          })}
        </ul>
      </div>
  );
}

ModalVerbsPreteritum.headerButton = (
    <button
        onClick={() =>
            document.dispatchEvent(
                new CustomEvent("show-modal-verbs-preteritum-hint")
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
