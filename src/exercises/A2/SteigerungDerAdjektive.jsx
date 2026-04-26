import { useEffect, useMemo, useState } from "react";
import ModalHtml from "../../components/ModalHtml";
import ExpandingInput from "../../components/ExpandingInput";
import ProgressiveList from "../../components/ProgressiveList";
import { useLocale } from "../../contexts/LocaleContext";
import { usePersistentAnswers } from "../../hooks/usePersistentAnswers";

import data from "../../../data/A2/steigerungDerAdjektive.json";
import slide1Ru from "../../../data/A2/images/steigerungderadjektive1.html?raw";
import slide2Ru from "../../../data/A2/images/steigerungderadjektive2.html?raw";
import slide3Ru from "../../../data/A2/images/steigerungderadjektive3.html?raw";
import slide1En from "../../../data/A2/images/en/steigerungderadjektive1.html?raw";
import slide2En from "../../../data/A2/images/en/steigerungderadjektive2.html?raw";
import slide3En from "../../../data/A2/images/en/steigerungderadjektive3.html?raw";

import "../../css/exercises/Common.css";

const STORAGE_KEY = "steigerung-der-adjektive-answers";
const PLACEHOLDER_TOKEN = "___";

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

function getAnswer(item) {
    if (Array.isArray(item?.answer)) return String(item.answer[0] ?? "");
    if (Array.isArray(item?.answers)) return String(item.answers[0] ?? "");
    return String(item?.answer ?? "");
}

function splitByPlaceholder(sentence) {
    const parts = String(sentence ?? "").split(PLACEHOLDER_TOKEN);
    if (parts.length < 2) return null;
    return {
        left: parts[0] ?? "",
        right: parts.slice(1).join(PLACEHOLDER_TOKEN),
    };
}

export default function SteigerungDerAdjektive() {
    const { locale } = useLocale();
    const [answers, setAnswers] = usePersistentAnswers(STORAGE_KEY, {});
    const [showHint, setShowHint] = useState(false);

    const slides = useMemo(
        () => (locale === "en" ? [slide1En, slide2En, slide3En] : [slide1Ru, slide2Ru, slide3Ru]),
        [locale]
    );
    const items = useMemo(() => (Array.isArray(data.items) ? data.items : []), []);

    useEffect(() => {
        const handleShowHint = () => setShowHint(true);
        document.addEventListener("show-hint", handleShowHint);
        return () => document.removeEventListener("show-hint", handleShowHint);
    }, []);

    const handleChange = (itemIdx, value, correctAnswer) => {
        const key = `steigerung-${itemIdx}`;
        const isCorrect = normalize(value) === normalize(correctAnswer);

        setAnswers((prev) => ({
            ...prev,
            [key]: {
                value,
                isCorrect,
            },
        }));
    };

    return (
        <div className="exercise-inner">
            {showHint && (
                <ModalHtml images={slides} initialIndex={0} onClose={() => setShowHint(false)} />
            )}

            <div className="scroll-container">
                <ProgressiveList items={items} className="list">
                    {(item, itemIdx) => {
                        const sentence = getLocalizedText(item.sentence, locale);
                        const placeholder = getLocalizedText(item.placeholder, locale);
                        const answer = getAnswer(item);
                        const placeholderParts = splitByPlaceholder(sentence);
                        const key = `steigerung-${itemIdx}`;
                        const value = answers[key]?.value ?? "";
                        const isCorrect = answers[key]?.isCorrect;
                        const hasValue = value.trim() !== "";
                        const inputClass = hasValue
                            ? isCorrect
                                ? "autosize-input correct"
                                : "autosize-input incorrect"
                            : "autosize-input";

                        return (
                            <li key={itemIdx} className="list-item">
                                {placeholderParts ? (
                                    <>
                                        {placeholderParts.left}
                                        <ExpandingInput
                                            type="text"
                                            value={value}
                                            onChange={(e) =>
                                                handleChange(itemIdx, e.target.value, answer)
                                            }
                                            className={inputClass}
                                            placeholder={placeholder}
                                            minWidth={90}
                                            mobileMinWidth={70}
                                            tabletMinWidth={80}
                                            maxWidth={280}
                                            aria-label={`Steigerung der Adjektive answer ${itemIdx + 1}`}
                                        />
                                        {placeholderParts.right}
                                    </>
                                ) : (
                                    <>
                                        <span className="sentence">{sentence} —</span>
                                        <ExpandingInput
                                            type="text"
                                            value={value}
                                            onChange={(e) =>
                                                handleChange(itemIdx, e.target.value, answer)
                                            }
                                            className={inputClass}
                                            placeholder={placeholder}
                                            minWidth={180}
                                            mobileMinWidth={110}
                                            tabletMinWidth={140}
                                            maxWidth={360}
                                            aria-label={`Steigerung der Adjektive answer ${itemIdx + 1}`}
                                        />
                                    </>
                                )}
                            </li>
                        );
                    }}
                </ProgressiveList>
            </div>
        </div>
    );
}

SteigerungDerAdjektive.headerButton = (
    <button
        type="button"
        className="hint-button"
        onClick={() => document.dispatchEvent(new CustomEvent("show-hint"))}
    >
        !
    </button>
);

SteigerungDerAdjektive.instructions = data.instructions;
SteigerungDerAdjektive.title = data.title;
