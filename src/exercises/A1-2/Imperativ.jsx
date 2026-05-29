import { useMemo } from "react";
import ModalHtml from "../../components/ModalHtml";
import { usePersistentAnswers } from "../../hooks/usePersistentAnswers";
import ExpandingInput from "../../components/ExpandingInput";
import ProgressiveList from "../../components/ProgressiveList";
import { useLocale } from "../../contexts/LocaleContext";
import { useTheoryModal } from "../../contexts/TheoryModalContext";

import data from "../../../data/A1-2/imperativ.json";
import hint1Ru from "../../../data/A1-2/images/imperativ1.html?raw";
import hint2Ru from "../../../data/A1-2/images/imperativ2.html?raw";
import hint3Ru from "../../../data/A1-2/images/imperativ3.html?raw";
import hint1En from "../../../data/A1-2/images/en/imperativ1.html?raw";
import hint2En from "../../../data/A1-2/images/en/imperativ2.html?raw";
import hint3En from "../../../data/A1-2/images/en/imperativ3.html?raw";

import "../../css/exercises/Common.css";

const STORAGE_KEY = "imperativ-answers";

function normalizeItems(rawItems) {
  // Some exercises keep items grouped by pages (array of arrays).
  if (Array.isArray(rawItems) && rawItems.length > 0 && Array.isArray(rawItems[0])) {
    return rawItems.flat();
  }
  return Array.isArray(rawItems) ? rawItems : [];
}

function Imperativ() {
  const { locale } = useLocale();
  const [answers, setAnswers] = usePersistentAnswers(STORAGE_KEY, {});
  const { isTheoryOpen: showHint, closeTheory } = useTheoryModal();

  const hintSlides = useMemo(
      () => (locale === "en" ? [hint1En, hint2En, hint3En] : [hint1Ru, hint2Ru, hint3Ru]),
      [locale]
  );
  const items = useMemo(() => normalizeItems(data.items), []);


  const handleChange = (itemIdx, blankIdx, value, correct) => {
    const key = `${itemIdx}-${blankIdx}`;
    const isCorrect = value.trim().toLowerCase() === correct.trim().toLowerCase();

    setAnswers((prev) => ({
      ...prev,
      [key]: { value, isCorrect },
    }));
  };

  const renderItem = (item, itemIdx) => {
    const parts = String(item.sentence || "").split("___");
    const correctAnswers = Array.isArray(item.answer) ? item.answer : [];
    const blanksCount = Math.min(parts.length - 1, correctAnswers.length);

    return (
      <li key={itemIdx} className="list-item">
        {parts.map((part, idx) => {
          const key = `${itemIdx}-${idx}`;
          const stored = answers[key];
          const value = stored?.value || "";
          const trimmed = value.trim();
          const isCorrect = stored?.isCorrect;

          let inputClass = "input";
          if (trimmed !== "") {
            inputClass += isCorrect ? " correct" : " incorrect";
          }

          const showInput = idx < blanksCount;
          const correct = correctAnswers[idx] ?? "";
          const placeholder = idx === 0 ? item.verb : undefined;

          return (
            <span key={idx}>
              {part}
              {showInput ? (
                  <ExpandingInput
                      type="text"
                      value={value}
                      placeholder={placeholder} // в первом blank: item.verb
                      onChange={(e) => handleChange(itemIdx, idx, e.target.value, correct)}
                      className={inputClass}
                      minWidth={40}
                      maxWidth={260}
                  />
              ) : null}
            </span>
          );
        })}
      </li>
    );
  };

  return (
    <div className="exercise-inner">
      {showHint && (
        <ModalHtml images={hintSlides} initialIndex={0} onClose={closeTheory} />
      )}

      <div className="scroll-container">
        <ProgressiveList items={items} className="list">
          {(item, idx) => renderItem(item, idx)}
        </ProgressiveList>
      </div>
    </div>
  );
}

Imperativ.hasHint = true;

Imperativ.instructions = data.instructions;
Imperativ.title = data.title;

export default Imperativ;
