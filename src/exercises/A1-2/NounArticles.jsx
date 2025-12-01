import { useState, useEffect } from "react";
import data from "../../../data/A1-2/noun_articles_with_gender_mismatch.json";
import { useLocale } from "../../contexts/LocaleContext";
import ModalImageGallery from "../../components/ModalImageGallery";
import image1 from "../../../data/A1-2/images/wordGender1.png";
import image2 from "../../../data/A1-2/images/wordGender2.png";
import { usePersistentAnswers } from "../../hooks/usePersistentAnswers";
import "../../css/exercises/Common.css";

const STORAGE_KEY = "noun-articles-answers";

function NounArticles() {
  const { locale } = useLocale();
  const [answers, setAnswers] = usePersistentAnswers(STORAGE_KEY, {});
  const [showGallery, setShowGallery] = useState(false);

  const hintImages = [
    { src: image1, alt: "Hint 1" },
    { src: image2, alt: "Hint 2" },
  ];

  useEffect(() => {
    const handleShowHint = () => {
      setShowGallery(true);
    };

    document.addEventListener("show-hint", handleShowHint);
    return () => {
      document.removeEventListener("show-hint", handleShowHint);
    };
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
        {showGallery && (
            <ModalImageGallery
                images={hintImages}
                onClose={() => setShowGallery(false)}
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
                    <input
                        type="text"
                        value={value}
                        onChange={(e) => handleChange(index, e.target.value)}
                        className={inputClassName}
                    />
                    {item.word.replace(/^_+/, "").trim()} — {item.translation[locale]}
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