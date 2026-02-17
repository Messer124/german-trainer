import { useEffect, useMemo, useState } from "react";
import ModalHtml from "../../components/ModalHtml";
import ExpandingInput from "../../components/ExpandingInput";
import { usePersistentAnswers } from "../../hooks/usePersistentAnswers";

import data from "../../../data/A2/prepositions.json";
import slide1 from "../../../data/A2/images/prepositions.html?raw";
import slide2 from "../../../data/A2/images/prepVerbs.html?raw";
import slide3 from "../../../data/A2/images/articles.html?raw";

import "../../css/exercises/Common.css";

const STORAGE_KEY = "wechselpraepositionen-answers";

function normalizeItems(rawItems) {
  if (Array.isArray(rawItems) && rawItems.length > 0 && Array.isArray(rawItems[0])) {
    return rawItems.flat();
  }
  return Array.isArray(rawItems) ? rawItems : [];
}

function normalize(v) {
  return String(v ?? "").trim().toLowerCase();
}

export default function Wechselpraepositionen() {
  const [answers, setAnswers] = usePersistentAnswers(STORAGE_KEY, {});
  const [showHint, setShowHint] = useState(false);

  const items = useMemo(() => normalizeItems(data.items), []);
  const slides = useMemo(() => [slide1, slide2, slide3], []);

  useEffect(() => {
    const handleShowHint = () => setShowHint(true);
    document.addEventListener("show-hint", handleShowHint);
    return () => document.removeEventListener("show-hint", handleShowHint);
  }, []);

  const handleChange = (itemIdx, blankIdx, value, correct) => {
    const key = `${itemIdx}-${blankIdx}`;
    const isCorrect = normalize(value) === normalize(correct);

    setAnswers((prev) => ({
      ...prev,
      [key]: { value, isCorrect },
    }));
  };

  const renderItem = (item, itemIdx) => {
    const parts = String(item.sentence ?? "").split(/_{3,}/);
    const correctAnswers = Array.isArray(item.answer) ? item.answer : [];

    const blanksCount = Math.min(parts.length - 1, correctAnswers.length, 2);

    return (
        <li key={itemIdx} className="list-item">
          {parts.map((part, idx) => {
            const key = `${itemIdx}-${idx}`;
            const stored = answers[key];
            const value = stored?.value || "";
            const trimmed = value.trim();
            const isCorrect = stored?.isCorrect;

            const showInput = idx < blanksCount;
            const correct = correctAnswers[idx] ?? "";

            const inputClass =
                trimmed === ""
                    ? "input"
                    : isCorrect
                        ? "input correct"
                        : "input incorrect";

            return (
                <span key={idx}>
              {part}
                  {showInput ? (
                      <ExpandingInput
                          type="text"
                          value={value}
                          onChange={(e) => handleChange(itemIdx, idx, e.target.value, correct)}
                          className={inputClass}
                          minWidth={100}
                          maxWidth={220}
                          aria-label={`Wechselpraepositionen blank ${idx + 1} (item ${itemIdx + 1})`}
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
            <ModalHtml images={slides} initialIndex={0} onClose={() => setShowHint(false)} />
        )}

        <div className="scroll-container">
          <ul className="list">{items.map((item, idx) => renderItem(item, idx))}</ul>
        </div>
      </div>
  );
}

Wechselpraepositionen.headerButton = (
    <button
        type="button"
        className="hint-button"
        onClick={() => document.dispatchEvent(new CustomEvent("show-hint"))}
    >
      !
    </button>
);

Wechselpraepositionen.instructions = data.instructions;
Wechselpraepositionen.title = data.title;