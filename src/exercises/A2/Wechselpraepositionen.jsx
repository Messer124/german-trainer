import { useEffect, useMemo, useState } from "react";
import ModalHtml from "../../components/ModalHtml";
import ExpandingInput from "../../components/ExpandingInput";
import SectionedProgressiveList from "../../components/SectionedProgressiveList";
import { useLocale } from "../../contexts/LocaleContext";
import { usePersistentAnswers } from "../../hooks/usePersistentAnswers";
import { normalizeExerciseSections } from "../../utils/sectionedExercise";
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

function splitByBlanks(sentence) {
  return String(sentence ?? "").split(TOKEN_RE);
}

export default function Wechselpraepositionen() {
  const { locale } = useLocale();
  const [answers, setAnswers] = usePersistentAnswers(STORAGE_KEY, {});
  const [showHint, setShowHint] = useState(false);

  const sections = useMemo(
      () => normalizeExerciseSections(data, locale, "wechselpraepositionen"),
      [locale]
  );
  const slides = useMemo(
      () => (locale === "en" ? [slide1En, slide2En] : [slide1Ru, slide2Ru]),
      [locale]
  );

  useEffect(() => {
    const handleShowHint = () => setShowHint(true);
    document.addEventListener("show-hint", handleShowHint);
    return () => document.removeEventListener("show-hint", handleShowHint);
  }, []);

  const setBlankValue = (sentenceIndex, blankIdx, value, correct) => {
    const key = `${sentenceIndex}-${blankIdx}`;
    const isCorrect = normalize(value) === normalize(correct);

    setAnswers((prev) => ({
      ...prev,
      [key]: { value, isCorrect },
    }));
  };

  const renderInsert = (row) => {
    const sentence = row.sentence;
    const translation = row.translation;
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
                      enableHint={true}
                      hintValue={correct}
                  />
              </span>
            );
          })}
        </span>
        </li>
    );
  };

  const renderTranslate = (row) => {
    const sentence = row.sentence;
    const correct = String(row.answer ?? "");

    const key = `${row.sentenceIndex}-0`;
    const stored = answers[key];
    const savedValue = stored?.value ?? "";
    const trimmed = savedValue.trim();
    const isCorrect = stored?.isCorrect;

    const inputClass =
        trimmed === ""
            ? "input"
            : isCorrect
                ? "input correct"
                : "input incorrect";

    return (
        <li key={row.key} className="list-item">
          <span className="sentence">{sentence} —</span>
          <ExpandingInput
              type="text"
              value={savedValue}
              onChange={(e) => setBlankValue(row.sentenceIndex, 0, e.target.value, correct)}
              className={inputClass}
              minWidth={220}
              tabletMinWidth={170}
              mobileMinWidth={110}
              maxWidth={860}
              enterKeyHint="next"
              aria-label={`Wechselpraepositionen translate answer (item ${row.sentenceIndex + 1})`}
              enableHint={true}
              hintValue={correct}
          />
        </li>
    );
  };

  return (
      <div className="exercise-inner">
        {showHint && (
            <ModalHtml images={slides} initialIndex={0} onClose={() => setShowHint(false)} />
        )}

        <SectionedProgressiveList
            sections={sections}
            className="list"
        >
            {(row) => {
              if (row.sectionType === "translate") return renderTranslate(row);
              return renderInsert(row);
            }}
        </SectionedProgressiveList>
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
