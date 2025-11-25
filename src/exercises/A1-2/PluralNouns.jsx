import { useEffect, useState } from "react";
import { Eye } from "lucide-react";
import { useLocale } from "../../contexts/LocaleContext";
import ModalImageGallery from "../../components/ModalImageGallery";
import data from "../../../data/A1-2/pluralNouns.json";
import "../../css/A1-2/PluralNouns.css";
import pluralImage1 from "../../../data/A1-2/images/pluralNouns1.png";
import pluralImage2 from "../../../data/A1-2/images/pluralNouns2.png";

function PluralNounsExercise() {
  const STORAGE_KEY = "plural-nouns-answers";
  const { locale } = useLocale();

  const [answers, setAnswers] = useState(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    try {
      return saved ? JSON.parse(saved) : {};
    } catch {
      return {};
    }
  });

  const [showGallery, setShowGallery] = useState(false);

  const hintImages = [
    { src: pluralImage1, alt: "Множественное число: подсказка 1" },
    { src: pluralImage2, alt: "Множественное число: подсказка 2" },
  ];

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(answers));
  }, [answers]);

  // очистка через кнопку "Очистить ответы" в сайдбаре
  useEffect(() => {
    const handleClear = () => {
      setAnswers({});
      localStorage.removeItem(STORAGE_KEY);
    };

    window.addEventListener("clear-plural-nouns-answers", handleClear);
    return () => {
      window.removeEventListener("clear-plural-nouns-answers", handleClear);
    };
  }, []);

  useEffect(() => {
    const handleShowHint = () => {
      setShowGallery(true);
    };

    document.addEventListener("show-plural-nouns-hint", handleShowHint);
    return () => {
      document.removeEventListener("show-plural-nouns-hint", handleShowHint);
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
      <div className="plural-container">
        {showGallery && (
            <ModalImageGallery
                images={hintImages}
                onClose={() => setShowGallery(false)}
            />
        )}
        <ul className="plural-list">
          {data.items.map((item, index) => {
            const stored = answers[index];
            const value = stored?.value || "";
            const trimmed = value.trim();
            const isCorrect = stored?.isCorrect;

            let inputClass = "plural-input";
            if (trimmed !== "") {
              inputClass += isCorrect ? " correct" : " incorrect";
            }

            const widthCh = Math.max(trimmed.length + 1, 6);

            return (
                <li className="plural-item" key={index}>
                  <span className="plural-singular">{item.word} — die</span>

                  <input
                      type="text"
                      className={inputClass}
                      value={value}
                      onChange={(e) => handleChange(index, e.target.value)}
                      style={{ width: `${widthCh}ch` }}
                  />

                  <span className="tooltip-container">
                                <span>
                                    <Eye size={18} />
                                </span>
                                <span className="tooltip">{item.plural}</span>
                            </span>
                </li>
            );
          })}
        </ul>
      </div>
  );
}

PluralNounsExercise.headerButton = (
    <button
        onClick={() =>
            document.dispatchEvent(new CustomEvent("show-plural-nouns-hint"))
        }
        className="hint-button"
    >
      !
    </button>
);

PluralNounsExercise.instructions = data.instructions;
PluralNounsExercise.title = data.title;

export default PluralNounsExercise;