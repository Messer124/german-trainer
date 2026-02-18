import { useEffect, useMemo, useState } from "react";
import ModalHtml from "../../components/ModalHtml";
import ExpandingInput from "../../components/ExpandingInput";
import { useLocale } from "../../contexts/LocaleContext";
import { usePersistentAnswers } from "../../hooks/usePersistentAnswers";

import data from "../../../data/A1-2/auxiliaryVerbs.json";
import hintRu from "../../../data/A1-2/images/auxiliaryVerbs.html?raw";
import hintEn from "../../../data/A1-2/images/en/auxiliaryVerbs.html?raw";

import "../../css/exercises/Common.css";

const STORAGE_KEY = "auxiliary-verbs-answers";

function normalizeItems(rawItems) {
  if (!Array.isArray(rawItems)) return [];

  if (rawItems.length > 0 && Array.isArray(rawItems[0])) {
    return rawItems.flat();
  }
  if (rawItems.length > 0 && rawItems[0] && Array.isArray(rawItems[0].items)) {
    return rawItems.flatMap((group) => (Array.isArray(group.items) ? group.items : []));
  }
  return rawItems;
}

function normalize(value) {
  return String(value ?? "").trim().toLowerCase();
}

function getAcceptableAnswers(answer) {
  if (Array.isArray(answer)) return answer;
  if (typeof answer === "string") return [answer];
  return [];
}

function AuxiliaryVerbs() {
  const { locale } = useLocale();
  const [answers, setAnswers] = usePersistentAnswers(STORAGE_KEY, {});
  const [showHint, setShowHint] = useState(false);

  const items = useMemo(() => normalizeItems(data.items), []);

  useEffect(() => {
    const handleShowHint = () => setShowHint(true);
    document.addEventListener("show-hint", handleShowHint);
    return () => document.removeEventListener("show-hint", handleShowHint);
  }, []);

  const handleChange = (index, value) => {
    const acceptable = getAcceptableAnswers(items[index]?.answer);
    const isCorrect = acceptable.some((a) => normalize(a) === normalize(value));

    setAnswers((prev) => ({
      ...prev,
      [index]: { value, isCorrect },
    }));
  };

  return (
      <div className="exercise-inner">
        {showHint && <ModalHtml html={locale === "en" ? hintEn : hintRu} onClose={() => setShowHint(false)} />}

        <div className="scroll-container">
          <ul className="list">
            {items.map((item, index) => {
              const stored = answers[index];
              const value = stored?.value || "";
              const trimmed = value.trim();
              const isCorrect = stored?.isCorrect;

              const parts = String(item.sentence ?? "").split("___");
              const left = parts[0] ?? "";
              const right = parts[1] ?? "";

              const inputClass =
                  trimmed === ""
                      ? "input"
                      : isCorrect
                          ? "input correct"
                          : "input incorrect";

              return (
                  <li key={index}>
                    {left}
                    <ExpandingInput
                        type="text"
                        value={value}
                        onChange={(e) => handleChange(index, e.target.value)}
                        className={inputClass}
                        minWidth={100}
                        maxWidth={260}
                        aria-label={`Auxiliary verbs: item ${index + 1}`}
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

AuxiliaryVerbs.headerButton = (
    <button
        type="button"
        className="hint-button"
        onClick={() => document.dispatchEvent(new CustomEvent("show-hint"))}
    >
      !
    </button>
);

AuxiliaryVerbs.instructions = data.instructions;
AuxiliaryVerbs.title = data.title;

export default AuxiliaryVerbs;
