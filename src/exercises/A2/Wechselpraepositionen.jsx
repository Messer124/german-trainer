import { Eye } from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";
import ModalHtml from "../../components/ModalHtml";
import ExpandingInput from "../../components/ExpandingInput";
import { useLocale } from "../../contexts/LocaleContext";
import { usePersistentAnswers } from "../../hooks/usePersistentAnswers";

import data from "../../../data/A2/prepositions.json";
import slide2Ru from "../../../data/A2/images/prepositions.html?raw";
import slide1Ru from "../../../data/A2/images/prepVerbs.html?raw";
import slide2En from "../../../data/A2/images/en/prepositions.html?raw";
import slide1En from "../../../data/A2/images/en/prepVerbs.html?raw";
import "../../css/exercises/Common.css";

const STORAGE_KEY = "wechselpraepositionen-answers";
const TOKEN_RE = /_{3,}|___/g;

function normalize(v) {
  return String(v ?? "").trim().toLowerCase().replace(/\s+/g, " ");
}

function getLocalizedText(raw, locale) {
  if (typeof raw === "string") return raw;
  if (raw && typeof raw === "object") return raw[locale] ?? raw.ru ?? raw.en ?? "";
  return "";
}

function getRows(rawItems) {
  const items = Array.isArray(rawItems) ? rawItems : [];
  const rows = [];

  let currentSection = null;
  let sentenceIndex = 0;

  items.forEach((item, rawIndex) => {
    if (!item || typeof item !== "object") return;

    const hasSentence = Object.prototype.hasOwnProperty.call(item, "sentence");
    const hasAnswer = Object.prototype.hasOwnProperty.call(item, "answer");

    if (typeof item.id === "string" && !hasSentence && !hasAnswer) {
      currentSection = item.id;
      rows.push({
        type: "divider",
        key: `wechsel-divider-${rawIndex}-${item.id}`,
        id: item.id,
        label: item.label,
      });
      return;
    }

    if (!hasSentence || !hasAnswer) return;

    const section = currentSection ?? "insert";

    rows.push({
      type: "item",
      section,
      key: `wechsel-item-${sentenceIndex}`,
      sentenceIndex,
      sentence: item.sentence,
      translation: item.translation,
      answer: item.answer,
    });

    sentenceIndex += 1;
  });

  return rows;
}

function splitByBlanks(sentence) {
  return String(sentence ?? "").split(TOKEN_RE);
}

export default function Wechselpraepositionen() {
  const { locale } = useLocale();
  const [answers, setAnswers] = usePersistentAnswers(STORAGE_KEY, {});
  const [showHint, setShowHint] = useState(false);
  const [previewValues, setPreviewValues] = useState({});
  const previewTimersRef = useRef({});

  const rows = useMemo(() => getRows(data.items), []);
  const slides = useMemo(
      () => (locale === "en" ? [slide1En, slide2En] : [slide1Ru, slide2Ru]),
      [locale]
  );

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

  const clearPreview = (key) => {
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
  };

  const setBlankValue = (sentenceIndex, blankIdx, value, correct) => {
    const key = `${sentenceIndex}-${blankIdx}`;
    clearPreview(key);

    const isCorrect = normalize(value) === normalize(correct);

    setAnswers((prev) => ({
      ...prev,
      [key]: { value, isCorrect },
    }));
  };

  const showAnswerPreview = (sentenceIndex, answer) => {
    const key = `${sentenceIndex}-0`;
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

  const preventStealFocus = (event) => {
    event.preventDefault();
  };

  const renderInsert = (row) => {
    const sentence = getLocalizedText(row.sentence, locale);
    const translation = getLocalizedText(row.translation, locale);
    const parts = splitByBlanks(sentence);

    const correctAnswers = Array.isArray(row.answer) ? row.answer.map(String) : [];
    const blanksCount = Math.min(parts.length - 1, correctAnswers.length);

    return (
        <li key={row.key} className="list-item">
          {translation ? <span className="sentence">{translation} — </span> : null}

          <span>
          {parts.map((part, idx) => {
            const showInput = idx < blanksCount;
            if (!showInput) return <span key={idx}>{part}</span>;

            const key = `${row.sentenceIndex}-${idx}`;
            const stored = answers[key];
            const value = stored?.value ?? "";
            const trimmed = value.trim();
            const isCorrect = stored?.isCorrect;

            const inputClass =
                trimmed === ""
                    ? "input"
                    : isCorrect
                        ? "input correct"
                        : "input incorrect";

            const correct = correctAnswers[idx] ?? "";

            return (
                <span key={idx}>
                {part}
                  <ExpandingInput
                      type="text"
                      value={value}
                      onChange={(e) =>
                          setBlankValue(row.sentenceIndex, idx, e.target.value, correct)
                      }
                      className={inputClass}
                      minWidth={90}
                      tabletMinWidth={75}
                      mobileMinWidth={65}
                      maxWidth={220}
                      enterKeyHint="next"
                      aria-label={`Wechselpraepositionen insert blank ${idx + 1} (item ${
                          row.sentenceIndex + 1
                      })`}
                  />
              </span>
            );
          })}
        </span>
        </li>
    );
  };

  const renderTranslate = (row) => {
    const sentence = getLocalizedText(row.sentence, locale);
    const correct = String(row.answer ?? "");

    const key = `${row.sentenceIndex}-0`;
    const stored = answers[key];
    const savedValue = stored?.value ?? "";
    const visibleValue = previewValues[key] ?? savedValue;
    const trimmed = visibleValue.trim();
    const isPreviewing = previewValues[key] != null;
    const isCorrect = stored?.isCorrect;

    const inputClass = isPreviewing
        ? "input"
        : trimmed === ""
            ? "input"
            : isCorrect
                ? "input correct"
                : "input incorrect";

    return (
        <li key={row.key} className="list-item">
          <span className="sentence">{sentence} —</span>
          <ExpandingInput
              type="text"
              value={visibleValue}
              onChange={(e) => setBlankValue(row.sentenceIndex, 0, e.target.value, correct)}
              className={inputClass}
              minWidth={220}
              tabletMinWidth={170}
              mobileMinWidth={110}
              maxWidth={860}
              enterKeyHint="next"
              readOnly={isPreviewing}
              aria-label={`Wechselpraepositionen translate answer (item ${row.sentenceIndex + 1})`}
          />
          <button
              type="button"
              className="eye-container eye-container--button"
              onPointerDown={preventStealFocus}
              onTouchStart={preventStealFocus}
              onMouseDown={preventStealFocus}
              onClick={() => showAnswerPreview(row.sentenceIndex, row.answer)}
              aria-label={`Show answer for sentence ${row.sentenceIndex + 1}`}
          >
          <span>
            <Eye size={18} />
          </span>
          </button>
        </li>
    );
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
                      <span>{getLocalizedText(row.label, locale)}</span>
                    </li>
                );
              }

              if (row.section === "translate") return renderTranslate(row);
              return renderInsert(row);
            })}
          </ul>
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
Wechselpraepositionen.title = data.title