import { useEffect, useMemo, useState } from "react";

import "../../css/exercises/Common.css";
import ExpandingInput from "../../components/ExpandingInput";
import ModalHtml from "../../components/ModalHtml";
import { usePersistentAnswers } from "../../hooks/usePersistentAnswers";
import { useLocale } from "../../contexts/LocaleContext";

import data from "../../../data/A1-1/posessive_pronouns.json";
import hintRu from "../../../data/A1-1/images/posessive_pronouns.html?raw";
import hintEn from "../../../data/A1-1/images/en/posessive_pronouns.html?raw";

const STORAGE_KEY = "possessive-pronouns-answers";
const TOKEN = "___";

function normalize(value) {
    return String(value ?? "")
        .trim()
        .toLowerCase()
        .replace(/\s+/g, " ");
}

function getLocalizedText(raw, locale) {
    if (typeof raw === "string") return raw;
    if (raw && typeof raw === "object") return raw[locale] ?? raw.ru ?? raw.en ?? "";
    return "";
}

function resolvePlaceholders(item, locale, blanksCount) {
    const raw = item?.placeholder;

    if (raw == null) return Array.from({ length: blanksCount }, () => undefined);

    if (Array.isArray(raw)) {
        const resolved = raw.map((p) => {
            const v = getLocalizedText(p, locale);
            return v ? v : undefined;
        });
        return Array.from({ length: blanksCount }, (_, i) => resolved[i]);
    }

    const single = getLocalizedText(raw, locale);
    return Array.from({ length: blanksCount }, (_, i) => (i === 0 && single ? single : undefined));
}

export default function PossessivePronouns() {
    const { locale } = useLocale();
    const [answers, setAnswers] = usePersistentAnswers(STORAGE_KEY, {});
    const [showHint, setShowHint] = useState(false);

    const slides = useMemo(() => {
        // Если вдруг EN отсутствует — безопасно откатимся на RU
        if (locale === "en") return [hintEn || hintRu];
        return [hintRu || hintEn];
    }, [locale]);

    useEffect(() => {
        const handleShowHint = () => setShowHint(true);
        document.addEventListener("show-hint", handleShowHint);
        return () => document.removeEventListener("show-hint", handleShowHint);
    }, []);

    const items = Array.isArray(data.items) ? data.items : [];

    const setBlankValue = (sentenceIdx, blankIdx, value, correctAnswers) => {
        const key = `${sentenceIdx}-${blankIdx}`;
        const correct = String(correctAnswers?.[blankIdx] ?? "");
        const isCorrect = normalize(value) === normalize(correct);

        setAnswers((prev) => ({
            ...prev,
            [key]: { value, isCorrect },
        }));
    };

    return (
        <div className="exercise-inner">
            {showHint && <ModalHtml images={slides} initialIndex={0} onClose={() => setShowHint(false)} />}

            <div className="scroll-container">
                <ul className="list">
                    {items.map((item, sentenceIdx) => {
                        const sentence = getLocalizedText(item.sentence, locale);
                        const correctAnswers = Array.isArray(item.answer)
                            ? item.answer.map((x) => String(x ?? ""))
                            : [String(item.answer ?? "")];

                        const parts = String(sentence).split(TOKEN);
                        const blanksCount = Math.max(0, parts.length - 1);
                        const placeholders = resolvePlaceholders(item, locale, blanksCount);

                        return (
                            <li key={`pp-${sentenceIdx}`} className="list-item">
                                {parts.map((part, partIdx) => {
                                    const isBlank = partIdx < blanksCount;
                                    if (!isBlank) return <span key={partIdx}>{part}</span>;

                                    const blankIdx = partIdx;
                                    const key = `${sentenceIdx}-${blankIdx}`;
                                    const value = answers[key]?.value ?? "";
                                    const isCorrect = answers[key]?.isCorrect;

                                    const hasValue = value.trim() !== "";
                                    const inputClass = hasValue
                                        ? isCorrect
                                            ? "autosize-input correct"
                                            : "autosize-input incorrect"
                                        : "autosize-input";

                                    return (
                                        <span key={partIdx}>
                      {part}
                                            <ExpandingInput
                                                type="text"
                                                className={inputClass}
                                                value={value}
                                                onChange={(e) =>
                                                    setBlankValue(sentenceIdx, blankIdx, e.target.value, correctAnswers)
                                                }
                                                placeholder={placeholders[blankIdx]}
                                                minWidth={110}
                                                tabletMinWidth={95}
                                                mobileMinWidth={80}
                                                maxWidth={420}
                                                enterKeyHint="next"
                                                aria-label={`PossessivePronouns ${sentenceIdx + 1} blank ${blankIdx + 1}`}
                                            />
                    </span>
                                    );
                                })}
                            </li>
                        );
                    })}
                </ul>
            </div>
        </div>
    );
}

PossessivePronouns.headerButton = (
    <button
        type="button"
        className="hint-button"
        onClick={() => document.dispatchEvent(new CustomEvent("show-hint"))}
    >
        !
    </button>
);

PossessivePronouns.instructions = data.instructions;
PossessivePronouns.title = data.title;