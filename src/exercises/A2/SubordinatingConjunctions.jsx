import { useEffect, useMemo, useState } from "react";
import ModalHtml from "../../components/ModalHtml";
import ExpandingInput from "../../components/ExpandingInput";
import { usePersistentAnswers } from "../../hooks/usePersistentAnswers";

import data from "../../../data/A2/subordinatingConjunctions.json";
import hint from "../../../data/A2/images/subordinatingConjunctions.html?raw";

import "../../css/exercises/Common.css";

const STORAGE_KEY = "subordinating-conjunctions-answers";

function normalize(s) {
  return String(s ?? "").trim().toLowerCase();
}

export default function SubordinatingConjunctions() {
  const [answers, setAnswers] = usePersistentAnswers(STORAGE_KEY, {});
  const [showHint, setShowHint] = useState(false);

  const items = useMemo(() => (Array.isArray(data.items) ? data.items : []), []);

  useEffect(() => {
    const handleShowHint = () => setShowHint(true);
    document.addEventListener("show-hint", handleShowHint);
    return () => document.removeEventListener("show-hint", handleShowHint);
  }, []);

  const handleChange = (index, value) => {
    const correct = normalize(items[index]?.answer);

    setAnswers((prev) => ({
      ...prev,
      [index]: {
        value,
        isCorrect: normalize(value) === correct,
      },
    }));
  };

  return (
      <div className="exercise-inner">
        {showHint && (
            <ModalHtml
                html={hint}
                onClose={() => setShowHint(false)}
            />
        )}

        <div className="scroll-container">
          <ul className="list">
            {items.map((item, index) => {
              const value = answers[index]?.value || "";
              const isCorrect = answers[index]?.isCorrect;

              const parts = String(item.sentence ?? "").split("___");
              const left = parts[0] ?? "";
              const right = parts[1] ?? "";

              const hasValue = value.trim() !== "";
              const inputClass = `input ${hasValue ? (isCorrect ? "correct" : "incorrect") : ""}`;

              return (
                  <li key={index} className="list-item">
                    {left}
                    <ExpandingInput
                        type="text"
                        value={value}
                        onChange={(e) => handleChange(index, e.target.value)}
                        className={inputClass}
                        minWidth={100}
                        aria-label={`Conjunction ${index + 1}`}
                    />
                    {right}
                  </li>
              );
            })}
          </ul>
        </div>
      </div>
  );
}

SubordinatingConjunctions.headerButton = (
    <button
        type="button"
        className="hint-button"
        onClick={() => document.dispatchEvent(new CustomEvent("show-hint"))}
    >
      !
    </button>
);

SubordinatingConjunctions.instructions = data.instructions;
SubordinatingConjunctions.title = data.title;