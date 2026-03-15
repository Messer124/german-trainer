import { useEffect, useMemo, useState } from "react";
import { useLocale } from "../../contexts/LocaleContext";
import ModalHtml from "../../components/ModalHtml";
import ExpandingInput from "../../components/ExpandingInput";
import { usePersistentAnswers } from "../../hooks/usePersistentAnswers";

import data from "../../../data/A2/passivPraesens.json";
import slide1Ru from "../../../data/A2/images/passivPraesens1.html?raw";
import slide2Ru from "../../../data/A2/images/passivPraesens2.html?raw";
import slide3Ru from "../../../data/A2/images/passivPraesens3.html?raw";
import slide4Ru from "../../../data/A2/images/passivPraesens4.html?raw";
import slide1En from "../../../data/A2/images/en/passivPraesens1.html?raw";
import slide2En from "../../../data/A2/images/en/passivPraesens2.html?raw";
import slide3En from "../../../data/A2/images/en/passivPraesens3.html?raw";
import slide4En from "../../../data/A2/images/en/passivPraesens4.html?raw";

import "../../css/exercises/Common.css";

const STORAGE_KEY = "passiv-praesens-answers";

function normalizeItems(rawItems) {
    if (Array.isArray(rawItems) && rawItems.length > 0 && Array.isArray(rawItems[0])) {
        return rawItems.flat();
    }
    return Array.isArray(rawItems) ? rawItems : [];
}

function normalize(value) {
    return String(value ?? "")
        .trim()
        .toLowerCase()
        .replace(/\s+/g, " ");
}

export default function PassivPraesens() {
    const { locale } = useLocale();
    const [answers, setAnswers] = usePersistentAnswers(STORAGE_KEY, {});
    const [showHint, setShowHint] = useState(false);

    const slides = useMemo(
        () => (locale === "en" ? [slide1En, slide2En, slide3En, slide4En] : [slide1Ru, slide2Ru, slide3Ru, slide4Ru]),
        [locale]
    );
    const items = useMemo(() => normalizeItems(data.items), []);

    useEffect(() => {
        const handleShowHint = () => setShowHint(true);
        document.addEventListener("show-hint", handleShowHint);
        return () => document.removeEventListener("show-hint", handleShowHint);
    }, []);

    const handleChange = (index, value) => {
        const key = `passiv-praesens-${index}`;
        const correct = normalize(items[index]?.answer);
        const isCorrect = normalize(value) === correct;

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
                    {items.map((item, index) => {
                        const key = `passiv-praesens-${index}`;
                        const value = answers[key]?.value ?? "";
                        const isCorrect = answers[key]?.isCorrect;
                        const inputClass =
                            value.trim() === ""
                                ? "autosize-input"
                                : isCorrect
                                    ? "autosize-input correct"
                                    : "autosize-input incorrect";

                        return (
                            <li key={index}>
                                <span className="sentence">{item.sentence?.[locale]}</span>
                                <ExpandingInput
                                    type="text"
                                    className={inputClass}
                                    value={value}
                                    onChange={(e) => handleChange(index, e.target.value)}
                                    minWidth={180}
                                    mobileMinWidth={90}
                                    tabletMinWidth={140}
                                    maxWidth={720}
                                    aria-label={`Passiv Präsens answer ${index + 1}`}
                                    enableHint={true}
                                    hintValue={item.answer}
                                />
                            </li>
                        );
                    })}
                </ul>
            </div>
        </div>
    );
}

PassivPraesens.headerButton = (
    <button
        type="button"
        className="hint-button"
        onClick={() => document.dispatchEvent(new CustomEvent("show-hint"))}
    >
        !
    </button>
);

PassivPraesens.instructions = data.instructions;
PassivPraesens.title = data.title;
