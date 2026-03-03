import { Eye } from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";
import ModalHtml from "../../components/ModalHtml";
import ExpandingInput from "../../components/ExpandingInput";
import { useLocale } from "../../contexts/LocaleContext";
import { usePersistentAnswers } from "../../hooks/usePersistentAnswers";

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

function getLocalizedText(raw, locale) {
  if (typeof raw === "string") return raw;
  if (raw && typeof raw === "object") {
    return raw[locale] ?? raw.ru ?? raw.en ?? "";
  }
  return "";
}

function getRows(rawItems, locale) {
  const items = Array.isArray(rawItems) ? rawItems : [];
  const rows = [];
  let sentenceIndex = 0;

  items.forEach((item, rawIndex) => {
    if (!item || typeof item !== "object") return;

    const hasSentence = Object.prototype.hasOwnProperty.call(item, "sentence");
    const hasAnswer = Object.prototype.hasOwnProperty.call(item, "answer");

    if (typeof item.id === "string" && !hasSentence && !hasAnswer) {
      const label = getLocalizedText(item.label, locale);
      if (!label) return;

      rows.push({
        type: "divider",
        key: `indefinitpronomen-divider-${rawIndex}-${item.id}`,
        label,
      });
      return;
    }

    if (!hasSentence || !hasAnswer) return;

    rows.push({
      type: "sentence",
      key: `indefinitpronomen-sentence-${sentenceIndex}`,
      sentenceIndex,
      sentence: getLocalizedText(item.sentence, locale),
      answer: String(item.answer ?? ""),
    });
    sentenceIndex += 1;
  });

  return rows;
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
  const [previewValues, setPreviewValues] = useState({});
  const previewTimersRef = useRef({});

  const slides = useMemo(
      () => (locale === "en" ? [slide1En, slide2En] : [slide1Ru, slide2Ru]),
      [locale]
  );
  const rows = useMemo(() => getRows(data.items, locale), [locale]);

  useEffect(() => {
    const handleShowHint = () => setShowHint(true);
    document.addEventListener("show-hint", handleShowHint);
    return () => document.removeEventListener("show-hint", handleShowHint);
  }, []);

  useEffect(() => {
    return () => {
      Object.values(previewTimersRef.current).forEach((timerId) => clearTimeout(timerId));
    };
  }, []);

  const handleChange = (sentenceIndex, value, correctAnswer) => {
    const key = `indefinitpronomen-${sentenceIndex}`;
    const isCorrect = normalize(value) === normalize(correctAnswer);

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

    setAnswers((prev) => ({ ...prev, [key]: { value, isCorrect } }));
  };

  const showAnswerPreview = (sentenceIndex, answer) => {
    const key = `indefinitpronomen-${sentenceIndex}`;
    const value = String(answer ?? "");
    if (!value) return;

    if (previewTimersRef.current[key]) clearTimeout(previewTimersRef.current[key]);

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
        {showHint && (
            <ModalHtml images={slides} initialIndex={0} onClose={() => setShowHint(false)} />
        )}

        <div className="scroll-container">
          <ul className="list">
            {rows.map((row) => {
              if (row.type === "divider") {
                return (
                    <li key={row.key} className="exercise-section-divider">
                      <span>{row.label}</span>
                    </li>
                );
              }

              const key = `indefinitpronomen-${row.sentenceIndex}`;
              const value = answers[key]?.value ?? "";
              const visibleValue = previewValues[key] ?? value;
              const isCorrect = answers[key]?.isCorrect;
              const hasValue = visibleValue.trim() !== "";
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
                      value={visibleValue}
                      onChange={(event) =>
                          handleChange(row.sentenceIndex, event.target.value, row.answer)
                      }
                      minWidth={inputSizes.minWidth}
                      tabletMinWidth={inputSizes.tabletMinWidth}
                      mobileMinWidth={inputSizes.mobileMinWidth}
                      maxWidth={inputSizes.maxWidth}
                      readOnly={previewValues[key] != null}
                      aria-label={`Indefinitpronomen answer ${row.sentenceIndex + 1}`}
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

                    {!placeholderParts && (
                        <button
                            type="button"
                            className="eye-container eye-container--button"
                            onClick={() => showAnswerPreview(row.sentenceIndex, row.answer)}
                            aria-label={`Show answer for sentence ${row.sentenceIndex + 1}`}
                        >
                                        <span>
                                            <Eye size={18} />
                                        </span>
                        </button>
                    )}
                  </li>
              );
            })}
          </ul>
        </div>
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