import { useEffect, useMemo, useState } from "react";
import ModalHtml from "../../components/ModalHtml";
import ExpandingInput from "../../components/ExpandingInput";
import { usePersistentAnswers } from "../../hooks/usePersistentAnswers";

import data from "../../../data/A1-2/conjunctions.json";
import slide1 from "../../../data/A1-2/images/conjunctions1.html?raw";
import slide2 from "../../../data/A1-2/images/conjunctions2.html?raw";
import slide3 from "../../../data/A1-2/images/conjunctions3.html?raw";
import slide4 from "../../../data/A1-2/images/conjunctions4.html?raw";

import "../../css/exercises/Common.css";

const STORAGE_KEY = "conjunctions-answers";

function normalize(s) {
  return String(s ?? "").trim().toLowerCase();
}

export default function Conjunctions() {
  const [answers, setAnswers] = usePersistentAnswers(STORAGE_KEY, {});
  const [showHint, setShowHint] = useState(false);

  const slides = useMemo(() => [slide1, slide2, slide3, slide4], []);
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
            <ModalHtml slides={slides} initialIndex={0} onClose={() => setShowHint(false)} />
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

Conjunctions.headerButton = (
    <button
        type="button"
        className="hint-button"
        onClick={() => document.dispatchEvent(new CustomEvent("show-hint"))}
    >
      !
    </button>
);

Conjunctions.instructions = data.instructions;
Conjunctions.title = data.title;