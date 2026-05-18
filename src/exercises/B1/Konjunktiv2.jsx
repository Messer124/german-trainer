import { useEffect, useMemo, useState } from "react";
import ModalHtml from "../../components/ModalHtml";
import ExpandingInput from "../../components/ExpandingInput";
import ProgressiveList from "../../components/ProgressiveList";
import { useLocale } from "../../contexts/LocaleContext";
import { usePersistentAnswers } from "../../hooks/usePersistentAnswers";

import data from "../../../data/B1/konjunktiv2.json";
import slide1Ru from "../../../data/B1/images/konjunktiv2-1.html?raw";
import slide2Ru from "../../../data/B1/images/konjunktiv2-2.html?raw";
import slide3Ru from "../../../data/B1/images/konjunktiv2-3.html?raw";
import slide4Ru from "../../../data/B1/images/konjunktiv2-4.html?raw";
import slide1En from "../../../data/B1/images/en/konjunktiv2-1.html?raw";
import slide2En from "../../../data/B1/images/en/konjunktiv2-2.html?raw";
import slide3En from "../../../data/B1/images/en/konjunktiv2-3.html?raw";
import slide4En from "../../../data/B1/images/en/konjunktiv2-4.html?raw";

import "../../css/exercises/Common.css";

const STORAGE_KEY = "b1-konjunktiv2-answers";

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

function getAcceptedAnswers(item) {
    const rawAnswers = Array.isArray(item?.answers)
        ? item.answers
        : Array.isArray(item?.answer)
            ? item.answer
            : [item?.answer];

    return rawAnswers
        .map((answer) => String(answer ?? "").trim())
        .filter(Boolean);
}

function getRows(rawItems, locale) {
    const items = Array.isArray(rawItems) ? rawItems : [];
    const rows = [];
    let sentenceIndex = 0;

    items.forEach((item, rawIndex) => {
        if (!item || typeof item !== "object") return;

        const hasSentence = Object.prototype.hasOwnProperty.call(item, "sentence");
        const acceptedAnswers = getAcceptedAnswers(item);

        if (typeof item.id === "string" && !hasSentence && acceptedAnswers.length === 0) {
            const label = getLocalizedText(item.label, locale);
            if (!label) return;

            rows.push({
                type: "divider",
                key: `b1-konjunktiv2-divider-${rawIndex}-${item.id}`,
                label,
            });
            return;
        }

        if (!hasSentence || acceptedAnswers.length === 0) return;

        rows.push({
            type: "sentence",
            key: `b1-konjunktiv2-sentence-${sentenceIndex}`,
            sentenceIndex,
            sentence: getLocalizedText(item.sentence, locale),
            placeholder: getLocalizedText(item.placeholder, locale),
            answers: acceptedAnswers,
        });
        sentenceIndex += 1;
    });

    return rows;
}

export default function Konjunktiv2() {
    const { locale } = useLocale();
    const [answers, setAnswers] = usePersistentAnswers(STORAGE_KEY, {});
    const [showHint, setShowHint] = useState(false);

    const slides = useMemo(
        () =>
            locale === "en"
                ? [slide1En, slide2En, slide3En, slide4En]
                : [slide1Ru, slide2Ru, slide3Ru, slide4Ru],
        [locale]
    );

    const rows = useMemo(() => getRows(data.items, locale), [locale]);

    useEffect(() => {
        const handleShowHint = () => setShowHint(true);
        document.addEventListener("show-hint", handleShowHint);
        return () => document.removeEventListener("show-hint", handleShowHint);
    }, []);

    const handleChange = (sentenceIndex, value, acceptedAnswers) => {
        const key = `b1-konjunktiv2-${sentenceIndex}`;
        const normalizedValue = normalize(value);
        const isCorrect = acceptedAnswers.some(
            (answer) => normalize(answer) === normalizedValue
        );

        setAnswers((prev) => ({
            ...prev,
            [key]: { value, isCorrect },
        }));
    };

    return (
        <div className="exercise-inner">
            {showHint && (
                <ModalHtml images={slides} initialIndex={0} onClose={() => setShowHint(false)} />
            )}

            <div className="scroll-container">
                <ProgressiveList items={rows} className="list">
                    {(row) => {
                        if (row.type === "divider") {
                            return (
                                <li key={row.key} className="exercise-section-divider">
                                    <span>{row.label}</span>
                                </li>
                            );
                        }

                        const key = `b1-konjunktiv2-${row.sentenceIndex}`;
                        const value = answers[key]?.value ?? "";
                        const isCorrect = answers[key]?.isCorrect;
                        const hasValue = value.trim() !== "";
                        const inputClass = hasValue
                            ? isCorrect
                                ? "autosize-input correct"
                                : "autosize-input incorrect"
                            : "autosize-input";

                        return (
                            <li key={row.key} className="list-item">
                                <span className="sentence">{row.sentence} —</span>
                                <ExpandingInput
                                    type="text"
                                    className={inputClass}
                                    value={value}
                                    placeholder={row.placeholder}
                                    onChange={(event) =>
                                        handleChange(row.sentenceIndex, event.target.value, row.answers)
                                    }
                                    minWidth={260}
                                    mobileMinWidth={130}
                                    tabletMinWidth={190}
                                    maxWidth={760}
                                    aria-label={`Konjunktiv II answer ${row.sentenceIndex + 1}`}
                                    enableHint
                                    hintValue={row.answers.join(" / ")}
                                />
                            </li>
                        );
                    }}
                </ProgressiveList>
            </div>
        </div>
    );
}

Konjunktiv2.headerButton = (
    <button
        type="button"
        className="hint-button"
        onClick={() => document.dispatchEvent(new CustomEvent("show-hint"))}
    >
        !
    </button>
);

Konjunktiv2.instructions = data.instructions;
Konjunktiv2.title = data.title;
