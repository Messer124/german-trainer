import { useEffect, useMemo, useRef, useState } from "react";
import { Eye } from "lucide-react";

import ModalHtml from "../../components/ModalHtml";
import ExpandingInput from "../../components/ExpandingInput";
import { usePersistentAnswers } from "../../hooks/usePersistentAnswers";

import data from "../../../data/A1-2/verbsPerfekt.json";
import hint from "../../../data/A1-2/images/partizip2.html?raw";

import "../../css/exercises/Common.css";

const STORAGE_KEY = "verbs-perfekt-answers";

function normalizeItems(rawItems) {
  if (Array.isArray(rawItems) && rawItems.length > 0 && Array.isArray(rawItems[0])) {
    return rawItems.flat();
  }
  return Array.isArray(rawItems) ? rawItems : [];
}

function normalize(v) {
  return String(v ?? "").trim().toLowerCase();
}

export default function VerbsPerfekt() {
  const [answers, setAnswers] = usePersistentAnswers(STORAGE_KEY, {});
  const [showHint, setShowHint] = useState(false);
  const [previewValues, setPreviewValues] = useState({});
  const previewTimersRef = useRef({});

  const items = useMemo(() => normalizeItems(data.items), []);

  useEffect(() => {
    const handleShowHint = () => setShowHint(true);
    document.addEventListener("show-hint", handleShowHint);
    return () => document.removeEventListener("show-hint", handleShowHint);
  }, []);

  useEffect(() => {
    return () => {
      Object.values(previewTimersRef.current).forEach((id) => clearTimeout(id));
    };
  }, []);

  const handleChange = (itemIdx, fieldIdx, value, correct) => {
    const key = `${itemIdx}-${fieldIdx}`;
    const isCorrect = normalize(value) === normalize(correct);

    if (previewTimersRef.current[key]) {
      clearTimeout(previewTimersRef.current[key]);
      delete previewTimersRef.current[key];
    }
    if (previewValues[key] != null) {
      setPreviewValues((prev) => {
        const next = { ...prev };
        delete next[key];
        return next;
      });
    }

    setAnswers((prev) => ({
      ...prev,
      [key]: { value, isCorrect },
    }));
  };

  const showAnswerPreview = (itemIdx, fieldIdx, answer) => {
    const key = `${itemIdx}-${fieldIdx}`;
    const value = String(answer ?? "");
    if (!value) return;

    if (previewTimersRef.current[key]) {
      clearTimeout(previewTimersRef.current[key]);
    }

    setPreviewValues((prev) => ({ ...prev, [key]: value }));

    previewTimersRef.current[key] = setTimeout(() => {
      setPreviewValues((prev) => {
        const next = { ...prev };
        delete next[key];
        return next;
      });
      delete previewTimersRef.current[key];
    }, 2000);
  };

  return (
      <div className="exercise-inner">
        {showHint && <ModalHtml html={hint} onClose={() => setShowHint(false)} />}

        <div className="scroll-container">
          <ul className="list">
            {items.map((item, itemIdx) => {
              // sentence с 2 пропусками: ___ ... ___
              const parts = String(item.sentence ?? "").split(/_{3,}/);
              const left = parts[0] ?? "";
              const middle = parts[1] ?? "";
              const right = parts[2] ?? "";

              const correct = Array.isArray(item.answer) ? item.answer : [];
              const correct0 = String(correct[0] ?? "");
              const correct1 = String(correct[1] ?? "");

              const key0 = `${itemIdx}-0`;
              const key1 = `${itemIdx}-1`;

              const stored0 = answers[key0];
              const stored1 = answers[key1];

              const value0 = stored0?.value ?? "";
              const value1 = stored1?.value ?? "";
              const visibleValue0 = previewValues[key0] ?? value0;
              const visibleValue1 = previewValues[key1] ?? value1;

              const class0 =
                  value0.trim() === ""
                      ? "input"
                      : stored0?.isCorrect
                          ? "input correct"
                          : "input incorrect";

              const class1 =
                  value1.trim() === ""
                      ? "input"
                      : stored1?.isCorrect
                          ? "input correct"
                          : "input incorrect";

              return (
                  <li key={itemIdx} className="list-item">
                    {left}

                    <ExpandingInput
                        type="text"
                        value={visibleValue0}
                        onChange={(e) => handleChange(itemIdx, 0, e.target.value, correct0)}
                        className={class0}
                        minWidth={70}
                        maxWidth={220}
                        readOnly={previewValues[key0] != null}
                        aria-label={`Perfekt blank 1 (item ${itemIdx + 1})`}
                    />

                    {middle}

                    <ExpandingInput
                        type="text"
                        value={visibleValue1}
                        onChange={(e) => handleChange(itemIdx, 1, e.target.value, correct1)}
                        className={class1}
                        // требование: инфинитив (verb) в placeholder второго поля
                        placeholder={item.verb}
                        maxWidth={260}
                        readOnly={previewValues[key1] != null}
                        aria-label={`Perfekt blank 2 (item ${itemIdx + 1})`}
                    />

                    {right}

                    {/* глазок только для второго поля — в конце предложения */}
                    <button
                        type="button"
                        className="eye-container eye-container--button"
                        title="Show answer"
                        onClick={() => showAnswerPreview(itemIdx, 1, correct1)}
                        aria-label={`Show answer for item ${itemIdx + 1}`}
                    >
                      <span>
                        <Eye size={18} />
                      </span>
                    </button>
                  </li>
              );
            })}
          </ul>
        </div>
      </div>
  );
}

VerbsPerfekt.headerButton = (
    <button
        type="button"
        className="hint-button"
        onClick={() => document.dispatchEvent(new CustomEvent("show-hint"))}
    >
      !
    </button>
);

VerbsPerfekt.instructions = data.instructions;
VerbsPerfekt.title = data.title;
