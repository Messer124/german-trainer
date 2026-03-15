import { useEffect, useState } from "react";
import ModalHtml from "../../components/ModalHtml";
import ExpandingInput from "../../components/ExpandingInput";
import { useLocale } from "../../contexts/LocaleContext";
import { usePersistentAnswers } from "../../hooks/usePersistentAnswers";
import data from "../../../data/A1-2/pluralNouns.json";
import "../../css/exercises/Common.css";
import hint1Ru from "../../../data/A1-2/images/pluralNouns1.html?raw";
import hint2Ru from "../../../data/A1-2/images/pluralNouns2.html?raw";
import hint1En from "../../../data/A1-2/images/en/pluralNouns1.html?raw";
import hint2En from "../../../data/A1-2/images/en/pluralNouns2.html?raw";

const STORAGE_KEY = "plural-nouns-answers";

function PluralNounsExercise() {
  const { locale } = useLocale();
  const [answers, setAnswers] = usePersistentAnswers(STORAGE_KEY, {});
  const [showHint, setShowHint] = useState(false);
  const hintSlides = locale === "en" ? [hint1En, hint2En] : [hint1Ru, hint2Ru];

  useEffect(() => {
    const handleShowHint = () => setShowHint(true);

    document.addEventListener("show-hint", handleShowHint);
    return () => document.removeEventListener("show-hint", handleShowHint);
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
              const stored = answers[index];
              const value = stored?.value || "";
              const trimmed = value.trim();
              const isCorrect = stored?.isCorrect;

              let inputClass = "input";
              if (trimmed !== "") {
                inputClass += isCorrect ? " correct" : " incorrect";
              }

              return (
                  <li key={index}>
                    <span className="plural-singular">{item.word} — die</span>

                    <ExpandingInput
                        type="text"
                        className={inputClass}
                        value={value}
                        onChange={(e) => handleChange(index, e.target.value)}
                        minWidth={120}
                        maxWidth={420}
                        enableHint={true}
                        hintValue={item.plural}
                    />
                  </li>
              );
            })}
          </ul>
        </div>
      </div>
  );
}

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
