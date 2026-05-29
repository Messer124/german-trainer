import { useMemo } from "react";
import ModalHtml from "../../components/ModalHtml";
import ExpandingInput from "../../components/ExpandingInput";
import ProgressiveList from "../../components/ProgressiveList";
import { useLocale } from "../../contexts/LocaleContext";
import { useTheoryModal } from "../../contexts/TheoryModalContext";
import { usePersistentAnswers } from "../../hooks/usePersistentAnswers";
import data from "../../../data/A1-2/verbsPerfekt.json";
import hintRu from "../../../data/A1-2/images/partizip2.html?raw";
import hintEn from "../../../data/A1-2/images/en/partizip2.html?raw";
import "../../css/exercises/Common.css";
import { normalizeAnswer } from "../../utils/answerUtils";

const STORAGE_KEY = "verbs-perfekt-answers";

function normalizeItems(rawItems) {
  if (Array.isArray(rawItems) && rawItems.length > 0 && Array.isArray(rawItems[0])) {
    return rawItems.flat();
  }
  return Array.isArray(rawItems) ? rawItems : [];
}

function normalize(v) {
    return normalizeAnswer(v);
}

function getLocalizedText(raw, locale) {
  if (typeof raw === "string") return raw;
  if (raw && typeof raw === "object") {
    return raw[locale] ?? raw.ru ?? raw.en ?? "";
  }
  return "";
}

export default function VerbsPerfekt() {
  const { locale } = useLocale();
  const [answers, setAnswers] = usePersistentAnswers(STORAGE_KEY, {});
  const { isTheoryOpen: showHint, closeTheory } = useTheoryModal();

  const items = useMemo(() => normalizeItems(data.items), []);


  const handleChange = (itemIdx, fieldIdx, value, correct) => {
    const key = `${itemIdx}-${fieldIdx}`;
    const isCorrect = normalize(value) === normalize(correct);

    setAnswers((prev) => ({
      ...prev,
      [key]: { value, isCorrect },
    }));
  };

  return (
      <div className="exercise-inner">
        {showHint && (
            <ModalHtml
                html={locale === "en" ? hintEn : hintRu}
                onClose={closeTheory}
            />
        )}

        <div className="scroll-container">
          <ProgressiveList items={items} className="list">
            {(item, itemIdx) => {
              const parts = String(item.sentence ?? "").split(/_{3,}/);
              const left = parts[0] ?? "";
              const middle = parts[1] ?? "";
              const right = parts[2] ?? "";
              const translation = getLocalizedText(item.translation, locale);

              const correct = Array.isArray(item.answer) ? item.answer : [];
              const correct0 = String(correct[0] ?? "");
              const correct1 = String(correct[1] ?? "");

              const key0 = `${itemIdx}-0`;
              const key1 = `${itemIdx}-1`;

              const stored0 = answers[key0];
              const stored1 = answers[key1];

              const value0 = stored0?.value ?? "";
              const value1 = stored1?.value ?? "";

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
                    {translation ? <span className="sentence">{translation} — </span> : null}

                    {left}

                    <ExpandingInput
                        type="text"
                        value={value0}
                        onChange={(e) => handleChange(itemIdx, 0, e.target.value, correct0)}
                        className={class0}
                        minWidth={70}
                        maxWidth={220}
                        aria-label={`Perfekt blank 1 (item ${itemIdx + 1})`}
                        enableHint={true}
                        hintValue={correct0}
                    />

                    {middle}

                    <ExpandingInput
                        type="text"
                        value={value1}
                        onChange={(e) => handleChange(itemIdx, 1, e.target.value, correct1)}
                        className={class1}
                        placeholder={item.verb}
                        maxWidth={260}
                        aria-label={`Perfekt blank 2 (item ${itemIdx + 1})`}
                        enableHint={true}
                        hintValue={correct1}
                    />

                    {right}
                  </li>
              );
            }}
          </ProgressiveList>
        </div>
      </div>
  );
}

VerbsPerfekt.hasHint = true;

VerbsPerfekt.instructions = data.instructions;
VerbsPerfekt.title = data.title;
