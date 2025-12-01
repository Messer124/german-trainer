import { useEffect, useState } from "react";
import { Eye } from "lucide-react";
import { useLocale } from "../../contexts/LocaleContext";
import ModalImageGallery from "../../components/ModalImageGallery";
import { usePersistentAnswers } from "../../hooks/usePersistentAnswers";
import data from "../../../data/A1-2/pluralNouns.json";
import "../../css/exercises/Common.css";
import hintImage1 from "../../../data/A1-2/images/pluralNouns1.png";
import hintImage2 from "../../../data/A1-2/images/pluralNouns2.png";

const STORAGE_KEY = "plural-nouns-answers";

function PluralNounsExercise() {
  const { locale } = useLocale();

  const [answers, setAnswers] = usePersistentAnswers(STORAGE_KEY, {});

  const [showGallery, setShowGallery] = useState(false);

  const hintImagesByLocale = {
    ru: [
      { src: hintImage1, alt: "Множественное число: подсказка 1" },
      { src: hintImage2, alt: "Множественное число: подсказка 2" },
    ],
    en: [
      { src: hintImage1, alt: "Plural nouns: hint 1" },
      { src: hintImage2, alt: "Plural nouns: hint 2" },
    ],
  };

  const hintImages = hintImagesByLocale[locale] || hintImagesByLocale.ru;

  // 4) Подсказка по глобальному событию (оставляем на этом этапе)
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
    const correct = data.items[index].plural.trim().toLowerCase();
    const isCorrect = value.trim().toLowerCase() === correct;

    setAnswers((prev) => ({
      ...prev,
      [index]: { value, isCorrect },
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
              const stored = answers[index];
              const value = stored?.value || "";
              const trimmed = value.trim();
              const isCorrect = stored?.isCorrect;

              let inputClass = "input";
              if (trimmed !== "") {
                inputClass += isCorrect ? " correct" : " incorrect";
              }

              const widthCh = Math.max(trimmed.length + 1, 6);

              return (
                  <li key={index}>
                    <span className="plural-singular">{item.word} — die</span>

                    <input
                        type="text"
                        className={inputClass}
                        value={value}
                        onChange={(e) => handleChange(index, e.target.value)}
                        style={{ width: `${widthCh}ch` }}
                    />

                    <span className="eye-container">
                      <span>
                          <Eye size={18} />
                      </span>
                      <span className="eye">{item.plural}</span>
                    </span>
                  </li>
              );
            })}
          </ul>
        </div>
      </div>
  );
}

// Кнопка подсказки для сайдбара
PluralNounsExercise.headerButton = (
    <button
        type="button"
        onClick={() =>
            document.dispatchEvent(new CustomEvent("show-hint"))
        }
        className="hint-button"
    >
      !
    </button>
);

PluralNounsExercise.instructions = data.instructions;
PluralNounsExercise.title = data.title;

export default PluralNounsExercise;