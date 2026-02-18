import { useState, useEffect } from "react";
import data from "../../../data/A1-2/noun_articles.json";
import { useLocale } from "../../contexts/LocaleContext";
import { usePersistentAnswers } from "../../hooks/usePersistentAnswers";
import "../../css/exercises/Common.css";
import ModalHtml from "../../components/ModalHtml";
import ExpandingInput from "../../components/ExpandingInput";
import hint1 from "../../../data/A1-2/images/wordGender1.html?raw";
import hint2 from "../../../data/A1-2/images/wordGender2.html?raw";

const STORAGE_KEY = "noun-articles-answers";

function NounArticles() {
  const { locale } = useLocale();
  const [answers, setAnswers] = usePersistentAnswers(STORAGE_KEY, {});
  const [showHint, setShowHint] = useState(false);
  const hintSlides = [hint1, hint2];

  useEffect(() => {
    const handleShowHint = () => setShowHint(true);

    document.addEventListener("show-hint", handleShowHint);
    return () => document.removeEventListener("show-hint", handleShowHint);
  }, []);

  const handleChange = (index, value) => {
    const correct = data.items[index].article.toLowerCase();

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
              const value = answers[index]?.value || "";
              const isCorrect = answers[index]?.isCorrect;

              const inputClassName =
                  "input" +
                  (value === ""
                      ? ""
                      : isCorrect
                          ? " correct"
                          : " incorrect");

              return (
                  <li key={index}>
                    <ExpandingInput
                        type="text"
                        value={value}
                        onChange={(e) => handleChange(index, e.target.value)}
                        className={inputClassName}
                        minWidth={90}
                        maxWidth={180}
                    />
                    {item.word.replace(/^_+/, "").trim()} —{" "}
                    {item.translation[locale]}
                  </li>
              );
            })}
          </ul>
        </div>
      </div>
  );
}

NounArticles.headerButton = (
    <button
        onClick={() =>
            document.dispatchEvent(new CustomEvent("show-hint"))
        }
        className="hint-button"
    >
      !
    </button>
);

NounArticles.instructions = data.instructions;
NounArticles.title = data.title;

export default NounArticles;
