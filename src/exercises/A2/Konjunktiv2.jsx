import { useEffect, useMemo, useState } from "react";
import ModalHtml from "../../components/ModalHtml";
import ExpandingInput from "../../components/ExpandingInput";
import { useLocale } from "../../contexts/LocaleContext";
import { usePersistentAnswers } from "../../hooks/usePersistentAnswers";

import data from "../../../data/A2/konjunktiv2.json";
import slide1Ru from "../../../data/A2/images/konjunktiv2-1.html?raw";
import slide2Ru from "../../../data/A2/images/konjunktiv2-2.html?raw";
import slide3Ru from "../../../data/A2/images/konjunktiv2-3.html?raw";
import slide4Ru from "../../../data/A2/images/konjunktiv2-4.html?raw";
import slide5Ru from "../../../data/A2/images/konjunktiv2-5.html?raw";
import slide1En from "../../../data/A2/images/en/konjunktiv2-1.html?raw";
import slide2En from "../../../data/A2/images/en/konjunktiv2-2.html?raw";
import slide3En from "../../../data/A2/images/en/konjunktiv2-3.html?raw";
import slide4En from "../../../data/A2/images/en/konjunktiv2-4.html?raw";
import slide5En from "../../../data/A2/images/en/konjunktiv2-5.html?raw";

import "../../css/exercises/Common.css";

const STORAGE_KEY = "konjunktiv2-answers";

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

function getAcceptedAnswers(rawAnswer, locale) {
    if (Array.isArray(rawAnswer)) {
        return rawAnswer
            .map((item) => getLocalizedText(item, locale))
            .map((item) => String(item ?? "").trim())
            .filter(Boolean);
    }

    if (typeof rawAnswer === "string") {
        const value = rawAnswer.trim();
        return value ? [value] : [];
    }

    if (rawAnswer && typeof rawAnswer === "object") {
        const value = getLocalizedText(rawAnswer, locale).trim();
        return value ? [value] : [];
    }

    return [];
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
                key: `konj2-divider-${rawIndex}-${item.id}`,
                label,
            });
            return;
        }

        if (!hasSentence || !hasAnswer) return;

        rows.push({
            type: "sentence",
            key: `konj2-sentence-${sentenceIndex}`,
            sentenceIndex,
            sentence: getLocalizedText(item.sentence, locale),
            answers: getAcceptedAnswers(item.answer, locale),
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
                ? [slide1En, slide2En, slide3En, slide4En, slide5En]
                : [slide1Ru, slide2Ru, slide3Ru, slide4Ru, slide5Ru],
        [locale]
    );

    const rows = useMemo(() => getRows(data.items, locale), [locale]);

    useEffect(() => {
        const handleShowHint = () => setShowHint(true);
        document.addEventListener("show-hint", handleShowHint);
        return () => document.removeEventListener("show-hint", handleShowHint);
    }, []);

    const handleChange = (sentenceIndex, value, acceptedAnswers) => {
        const key = `konjunktiv2-${sentenceIndex}`;
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
                <ul className="list">
                    {rows.map((row) => {
                        if (row.type === "divider") {
                            return (
                                <li key={row.key} className="exercise-section-divider">
                                    <span>{row.label}</span>
                                </li>
                            );
                        }

                        const key = `konjunktiv2-${row.sentenceIndex}`;
                        const value = answers[key]?.value ?? "";
                        const isCorrect = answers[key]?.isCorrect;
                        const hasValue = value.trim() !== "";
                        const inputClass = hasValue
                            ? isCorrect
                                ? "autosize-input correct"
                                : "autosize-input incorrect"
                            : "autosize-input";

                        return (
                            <li key={row.key}>
                                <span className="sentence">{row.sentence}</span>
                                <ExpandingInput
                                    type="text"
                                    className={inputClass}
                                    value={value}
                                    onChange={(event) =>
                                        handleChange(row.sentenceIndex, event.target.value, row.answers)
                                    }
                                    minWidth={180}
                                    maxWidth={760}
                                    aria-label={`Konjunktiv II answer ${row.sentenceIndex + 1}`}
                                    enableHint={true}
                                    hintValue={row.answers[0] ?? ""}
                                />
                            </li>
                        );
                    })}
                </ul>
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