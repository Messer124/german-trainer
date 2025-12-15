import { useEffect, useMemo, useState } from "react";
import ModalHtml from "../../components/ModalHtml";
import { usePersistentAnswers } from "../../hooks/usePersistentAnswers";
import ExpandingInput from "../../components/ExpandingInput";

import data from "../../../data/A1-2/imperativ.json";
import hint1 from "../../../data/A1-2/images/imperativ1.html?raw";
import hint2 from "../../../data/A1-2/images/imperativ2.html?raw";
import hint3 from "../../../data/A1-2/images/imperativ3.html?raw";

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
  const [answers, setAnswers] = usePersistentAnswers(STORAGE_KEY, {});
  const [showHint, setShowHint] = useState(false);

  const hintSlides = useMemo(() => [hint1, hint2, hint3], []);
  const items = useMemo(() => normalizeItems(data.items), []);

  useEffect(() => {
    const handleShowHint = () => setShowHint(true);
    document.addEventListener("show-hint", handleShowHint);
    return () => document.removeEventListener("show-hint", handleShowHint);
  }, []);

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
        <ModalHtml images={hintSlides} initialIndex={0} onClose={() => setShowHint(false)} />
      )}

      <div className="scroll-container">
        <ul className="list">{items.map((item, idx) => renderItem(item, idx))}</ul>
      </div>
    </div>
  );
}

Imperativ.headerButton = (
  <button
    type="button"
    className="hint-button"
    onClick={() => document.dispatchEvent(new CustomEvent("show-hint"))}
  >
    !
  </button>
);

Imperativ.instructions = data.instructions;
Imperativ.title = data.title;

export default Imperativ;
