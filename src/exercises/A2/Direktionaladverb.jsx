import { Eye } from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";
import ModalHtml from "../../components/ModalHtml";
import ExpandingInput from "../../components/ExpandingInput";
import { useLocale } from "../../contexts/LocaleContext";
import { usePersistentAnswers } from "../../hooks/usePersistentAnswers";

import data from "../../../data/A2/direktionaladverb.json";
import slide1Ru from "../../../data/A2/images/adverbien.html?raw";
import slide2Ru from "../../../data/A2/images/prefixes.html?raw";
import slide1En from "../../../data/A2/images/en/adverbien.html?raw";
import slide2En from "../../../data/A2/images/en/prefixes.html?raw";

import "../../css/exercises/Common.css";

const STORAGE_KEY = "adverbien-answers";

function normalize(value) {
  return String(value ?? "")
      .trim()
      .toLowerCase()
      .replace(/\s+/g, " ");
}

function getAcceptableAnswers(raw) {
  if (Array.isArray(raw)) return raw.map(String);
  if (typeof raw === "string") return [raw];
  return [];
}

function getSentenceText(rawSentence, locale) {
  if (typeof rawSentence === "string") return rawSentence;
  if (rawSentence && typeof rawSentence === "object") {
    return rawSentence[locale] ?? rawSentence.ru ?? rawSentence.en ?? "";
  }
  return "";
}

export default function Direktionaladverb() {
  const { locale } = useLocale();
  const [answers, setAnswers] = usePersistentAnswers(STORAGE_KEY, {});
  const [showHint, setShowHint] = useState(false);
  const [previewValues, setPreviewValues] = useState({});
  const previewTimersRef = useRef({});

  const slides = useMemo(
      () => (locale === "en" ? [slide1En, slide2En] : [slide1Ru, slide2Ru]),
      [locale]
  );
  const items = useMemo(() => (Array.isArray(data.items) ? data.items : []), []);

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

  const clearPreview = (index) => {
    if (previewTimersRef.current[index]) {
      clearTimeout(previewTimersRef.current[index]);
      delete previewTimersRef.current[index];
    }

    if (previewValues[index] != null) {
      setPreviewValues((prev) => {
        const next = { ...prev };
        delete next[index];
        return next;
      });
    }
  };

  const handleChange = (index, value) => {
    clearPreview(index);

    const acceptable = getAcceptableAnswers(
        items[index]?.answers ?? items[index]?.answer
    );
    const normalizedValue = normalize(value);
    const isCorrect = acceptable.some((a) => normalize(a) === normalizedValue);

    setAnswers((prev) => ({
      ...prev,
      [index]: { value, isCorrect },
    }));
  };

  const showAnswerPreview = (index) => {
    const acceptable = getAcceptableAnswers(
        items[index]?.answers ?? items[index]?.answer
    );
    const previewValue = acceptable[0] ?? "";

    if (!previewValue) return;

    if (previewTimersRef.current[index]) {
      clearTimeout(previewTimersRef.current[index]);
    }

    setPreviewValues((prev) => ({
      ...prev,
      [index]: previewValue,
    }));

    previewTimersRef.current[index] = setTimeout(() => {
      setPreviewValues((prev) => {
        const next = { ...prev };
        delete next[index];
        return next;
      });
      delete previewTimersRef.current[index];
    }, 2000);
  };

  const preventStealFocus = (event) => {
    event.preventDefault();
  };

  return (
      <div className="exercise-inner">
        {showHint && (
            <ModalHtml images={slides} initialIndex={0} onClose={() => setShowHint(false)} />
        )}

        <div className="scroll-container">
          <ul className="list">
            {items.map((item, index) => {
              const stored = answers[index];
              const savedValue = stored?.value ?? "";
              const visibleValue = previewValues[index] ?? savedValue;
              const trimmed = visibleValue.trim();
              const isPreviewing = previewValues[index] != null;
              const isCorrect = stored?.isCorrect;

              const inputClass = isPreviewing
                  ? "input"
                  : trimmed === ""
                      ? "input"
                      : isCorrect
                          ? "input correct"
                          : "input incorrect";

              return (
                  <li key={index} className="list-item">
                <span className="sentence">
                  {getSentenceText(item.sentence, locale)} —
                </span>

                    <ExpandingInput
                        type="text"
                        value={visibleValue}
                        onChange={(e) => handleChange(index, e.target.value)}
                        className={inputClass}
                        minWidth={140}
                        maxWidth={460}
                        readOnly={isPreviewing}
                        aria-label={`Adverbien answer ${index + 1}`}
                    />

                    <button
                        type="button"
                        className="eye-container eye-container--button"
                        onPointerDown={preventStealFocus}
                        onTouchStart={preventStealFocus}
                        onMouseDown={preventStealFocus}
                        onClick={() => showAnswerPreview(index)}
                        aria-label={`Show answer for sentence ${index + 1}`}
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

Direktionaladverb.headerButton = (
    <button
        type="button"
        className="hint-button"
        onClick={() => document.dispatchEvent(new CustomEvent("show-hint"))}
    >
      !
    </button>
);

Direktionaladverb.title = data.title;
Direktionaladverb.instructions = data.instructions;