import { useEffect, useMemo, useState } from "react";
import ModalHtml from "../../components/ModalHtml";
import ExpandingInput from "../../components/ExpandingInput";
import ProgressiveList from "../../components/ProgressiveList";
import { useLocale } from "../../contexts/LocaleContext";
import { usePersistentAnswers } from "../../hooks/usePersistentAnswers";
import { getLocalizedText } from "../../utils/sectionedExercise";

import data from "../../../data/B1/praepositionenMitGenitiv.json";
import slide1Ru from "../../../data/B1/images/praepositionenMitGenitiv-1.html?raw";
import slide2Ru from "../../../data/B1/images/praepositionenMitGenitiv-2.html?raw";
import slide3Ru from "../../../data/B1/images/praepositionenMitGenitiv-3.html?raw";
import slide1En from "../../../data/B1/images/en/praepositionenMitGenitiv-1.html?raw";
import slide2En from "../../../data/B1/images/en/praepositionenMitGenitiv-2.html?raw";
import slide3En from "../../../data/B1/images/en/praepositionenMitGenitiv-3.html?raw";

import "../../css/exercises/Common.css";

const STORAGE_KEY = "praepositionen-mit-genitiv-answers";

function normalize(value) {
    return String(value ?? "")
        .trim()
        .toLowerCase()
        .replace(/\s+/g, " ");
}

export default function PraepositionenMitGenitiv() {
    const { locale } = useLocale();
    const [answers, setAnswers] = usePersistentAnswers(STORAGE_KEY, {});
    const [showHint, setShowHint] = useState(false);

    const slides = useMemo(
        () =>
            locale === "en"
                ? [slide1En, slide2En, slide3En]
                : [slide1Ru, slide2Ru, slide3Ru],
        [locale]
    );

    const items = useMemo(
        () =>
            (Array.isArray(data.items) ? data.items : []).map((item, itemIndex) => ({
                ...item,
                key: `praepositionen-mit-genitiv-${itemIndex}`,
                sentenceIndex: itemIndex,
                sentence: getLocalizedText(item.sentence, locale),
                answers: Array.isArray(item.answers) ? item.answers : [],
            })),
        [locale]
    );

    useEffect(() => {
        const handleShowHint = () => setShowHint(true);
        document.addEventListener("show-hint", handleShowHint);
        return () => document.removeEventListener("show-hint", handleShowHint);
    }, []);

    const handleChange = (sentenceIndex, value, acceptedAnswers) => {
        const key = `${sentenceIndex}`;
        const normalizedValue = normalize(value);
        const isCorrect = acceptedAnswers.some(
            (answer) => normalize(answer) === normalizedValue
        );

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
                    {(row) => {
                        const key = `${row.sentenceIndex}`;
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
                                    value={value}
                                    onChange={(e) =>
                                        handleChange(row.sentenceIndex, e.target.value, row.answers)
                                    }
                                    className={inputClass}
                                    enableHint
                                    hintValue={row.answers.join(" / ")}
                                    minWidth={200}
                                    mobileMinWidth={150}
                                    tabletMinWidth={240}
                                    maxWidth={920}
                                    aria-label={`Präpositionen mit Genitiv answer ${row.sentenceIndex + 1}`}
                                />
                            </li>
                        );
                    }}
                </ProgressiveList>
            </div>
        </div>
    );
}

PraepositionenMitGenitiv.headerButton = (
    <button
        type="button"
        className="hint-button"
        onClick={() => document.dispatchEvent(new CustomEvent("show-hint"))}
    >
        !
    </button>
);

PraepositionenMitGenitiv.instructions = data.instructions;
PraepositionenMitGenitiv.title = data.title;
