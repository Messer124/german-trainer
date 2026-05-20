import { useEffect, useMemo, useState } from "react";
import ModalHtml from "../../components/ModalHtml";
import ExpandingInput from "../../components/ExpandingInput";
import SectionedProgressiveList from "../../components/SectionedProgressiveList";
import { useLocale } from "../../contexts/LocaleContext";
import { usePersistentAnswers } from "../../hooks/usePersistentAnswers";
import { normalizeExerciseSections } from "../../utils/sectionedExercise";

import data from "../../../data/A2/indefinitpronomen.json";
import slide1Ru from "../../../data/A2/images/indefinitpronomen1.html?raw";
import slide2Ru from "../../../data/A2/images/indefinitpronomen2.html?raw";
import slide1En from "../../../data/A2/images/en/indefinitpronomen1.html?raw";
import slide2En from "../../../data/A2/images/en/indefinitpronomen2.html?raw";

import "../../css/exercises/Common.css";

const STORAGE_KEY = "indefinitpronomen-answers";
const PLACEHOLDER = "___";

function normalize(value) {
  return String(value ?? "")
      .trim()
      .toLowerCase()
      .replace(/\s+/g, " ");
}

function splitByPlaceholder(sentence) {
  const parts = String(sentence ?? "").split(PLACEHOLDER);
  if (parts.length < 2) return null;
  return { left: parts[0] ?? "", right: parts.slice(1).join(PLACEHOLDER) };
}

export default function Indefinitpronomen() {
  const { locale } = useLocale();
  const [answers, setAnswers] = usePersistentAnswers(STORAGE_KEY, {});
  const [showHint, setShowHint] = useState(false);

  const slides = useMemo(
      () => (locale === "en" ? [slide1En, slide2En] : [slide1Ru, slide2Ru]),
      [locale]
  );
  const sections = useMemo(
      () => normalizeExerciseSections(data, locale, "indefinitpronomen"),
      [locale]
  );

  useEffect(() => {
    const handleShowHint = () => setShowHint(true);
    document.addEventListener("show-hint", handleShowHint);
    return () => document.removeEventListener("show-hint", handleShowHint);
  }, []);

  const handleChange = (sentenceIndex, value, correctAnswer) => {
    const key = `indefinitpronomen-${sentenceIndex}`;
    const isCorrect = normalize(value) === normalize(correctAnswer);

    setAnswers((prev) => ({ ...prev, [key]: { value, isCorrect } }));
  };

  return (
      <div className="exercise-inner">
        {showHint && (
            <ModalHtml images={slides} initialIndex={0} onClose={() => setShowHint(false)} />
        )}

        <SectionedProgressiveList sections={sections} className="list">
            {(row) => {
              const key = `indefinitpronomen-${row.sentenceIndex}`;
              const value = answers[key]?.value ?? "";
              const isCorrect = answers[key]?.isCorrect;
              const hasValue = value.trim() !== "";
              const inputClass = hasValue
                  ? isCorrect
                      ? "autosize-input correct"
                      : "autosize-input incorrect"
                  : "autosize-input";

              const placeholderParts = splitByPlaceholder(row.sentence);
              const inlineInput = Boolean(placeholderParts);

              const inputSizes = inlineInput
                  ? { minWidth: 90, tabletMinWidth: 75, mobileMinWidth: 60, maxWidth: 520 }
                  : { minWidth: 220, tabletMinWidth: 170, mobileMinWidth: 110, maxWidth: 860 };

              const input = (
                  <ExpandingInput
                      type="text"
                      className={inputClass}
                      value={value}
                      onChange={(event) =>
                          handleChange(row.sentenceIndex, event.target.value, row.answer)
                      }
                      minWidth={inputSizes.minWidth}
                      tabletMinWidth={inputSizes.tabletMinWidth}
                      mobileMinWidth={inputSizes.mobileMinWidth}
                      maxWidth={inputSizes.maxWidth}
                      aria-label={`Indefinitpronomen answer ${row.sentenceIndex + 1}`}
                      enableHint={true}
                      hintValue={row.answer}
                  />
              );

              return (
                  <li key={row.key}>
                    {placeholderParts ? (
                        <>
                          {placeholderParts.left}
                          {input}
                          {placeholderParts.right}
                        </>
                    ) : (
                        <>
                          <span className="sentence">{row.sentence} —</span>
                          {input}
                        </>
                    )}
                  </li>
              );
            }}
        </SectionedProgressiveList>
      </div>
  );
}

Indefinitpronomen.headerButton = (
    <button
        type="button"
        className="hint-button"
        onClick={() => document.dispatchEvent(new CustomEvent("show-hint"))}
    >
      !
    </button>
);

Indefinitpronomen.instructions = data.instructions;
Indefinitpronomen.title = data.title;
