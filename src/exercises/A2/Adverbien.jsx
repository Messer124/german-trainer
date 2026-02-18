import { useEffect, useMemo, useState } from "react";
import ModalHtml from "../../components/ModalHtml";
import ExpandingInput from "../../components/ExpandingInput";
import { useLocale } from "../../contexts/LocaleContext";
import { usePersistentAnswers } from "../../hooks/usePersistentAnswers";

import data from "../../../data/A2/adverbien.json";
import slide1Ru from "../../../data/A2/images/adverbien.html?raw";
import slide2Ru from "../../../data/A2/images/prefixes.html?raw";
import slide1En from "../../../data/A2/images/en/adverbien.html?raw";
import slide2En from "../../../data/A2/images/en/prefixes.html?raw";

import "../../css/exercises/Common.css";

const STORAGE_KEY = "adverbien-answers";

function normalize(value) {
  return String(value ?? "")
    .trim()
    .toLowerCase()
    .replace(/\s+/g, " ");
}

function getAcceptableAnswers(raw) {
  if (Array.isArray(raw)) return raw.map(String);
  if (typeof raw === "string") return [raw];
  return [];
}

export default function Adverbien() {
  const { locale } = useLocale();
  const [answers, setAnswers] = usePersistentAnswers(STORAGE_KEY, {});
  const [showHint, setShowHint] = useState(false);

  const slides = useMemo(
    () => (locale === "en" ? [slide1En, slide2En] : [slide1Ru, slide2Ru]),
    [locale]
  );
  const items = useMemo(() => (Array.isArray(data.items) ? data.items : []), []);

  useEffect(() => {
    const handleShowHint = () => setShowHint(true);
    document.addEventListener("show-hint", handleShowHint);
    return () => document.removeEventListener("show-hint", handleShowHint);
  }, []);

  const handleChange = (index, value) => {
    const acceptable = getAcceptableAnswers(items[index]?.answers);
    const normalizedValue = normalize(value);
    const isCorrect = acceptable.some((a) => normalize(a) === normalizedValue);

    setAnswers((prev) => ({
      ...prev,
      [index]: { value, isCorrect },
    }));
  };

  return (
    <div className="exercise-inner">
      {showHint && (
        <ModalHtml images={slides} initialIndex={0} onClose={() => setShowHint(false)} />
      )}

      <div className="scroll-container">
        <ul className="list">
          {items.map((item, index) => {
            const stored = answers[index];
            const value = stored?.value ?? "";
            const trimmed = value.trim();
            const isCorrect = stored?.isCorrect;

            const inputClass =
              trimmed === "" ? "input" : isCorrect ? "input correct" : "input incorrect";

            return (
              <li key={index} className="list-item">
                <span className="sentence">{item.sentence} —</span>

                <ExpandingInput
                  type="text"
                  value={value}
                  onChange={(e) => handleChange(index, e.target.value)}
                  className={inputClass}
                  minWidth={140}
                  maxWidth={460}
                  aria-label={`Adverbien answer ${index + 1}`}
                />
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  );
}

Adverbien.headerButton = (
  <button
    type="button"
    className="hint-button"
    onClick={() => document.dispatchEvent(new CustomEvent("show-hint"))}
  >
    !
  </button>
);

// В JSON нет поля title — задаём локально, чтобы заголовок не был пустым.
Adverbien.title = { ru: "Adverbien", en: "Adverbien" };
Adverbien.instructions = data.instructions;
