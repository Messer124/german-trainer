import { useEffect, useMemo, useState } from "react";
import ModalHtml from "../../components/ModalHtml";
import ExpandingInput from "../../components/ExpandingInput";
import SectionedProgressiveList from "../../components/SectionedProgressiveList";
import { useLocale } from "../../contexts/LocaleContext";
import { usePersistentAnswers } from "../../hooks/usePersistentAnswers";
import { normalizeExerciseSections } from "../../utils/sectionedExercise";

import data from "../../../data/A2/plusquamperfekt.json";
import slideRu from "../../../data/A2/images/plusquamperfekt.html?raw";
import slideEn from "../../../data/A2/images/en/plusquamperfekt.html?raw";

import "../../css/exercises/Common.css";

const STORAGE_KEY = "plusquamperfekt-answers";

function normalize(value) {
    return String(value ?? "")
        .trim()
        .toLowerCase()
        .replace(/\s+/g, " ");
}

export default function Plusquamperfekt() {
    const { locale } = useLocale();
    const [answers, setAnswers] = usePersistentAnswers(STORAGE_KEY, {});
    const [showHint, setShowHint] = useState(false);

    const slides = useMemo(() => (locale === "en" ? [slideEn] : [slideRu]), [locale]);
    const sections = useMemo(
        () => normalizeExerciseSections(data, locale, "plusquamperfekt"),
        [locale]
    );

    useEffect(() => {
        const handleShowHint = () => setShowHint(true);
        document.addEventListener("show-hint", handleShowHint);
        return () => document.removeEventListener("show-hint", handleShowHint);
    }, []);

    const handleChange = (sentenceIndex, value, correctAnswer) => {
        const key = `plusquamperfekt-${sentenceIndex}`;
        const isCorrect = normalize(value) === normalize(correctAnswer);

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

            <SectionedProgressiveList sections={sections} className="list">
                    {(row) => {
                        const key = `plusquamperfekt-${row.sentenceIndex}`;
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
                                <span className="sentence">{row.sentence} —</span>
                                <ExpandingInput
                                    type="text"
                                    className={inputClass}
                                    value={value}
                                    onChange={(event) =>
                                        handleChange(row.sentenceIndex, event.target.value, row.answer)
                                    }
                                    minWidth={220}
                                    tabletMinWidth={170}
                                    mobileMinWidth={110}
                                    maxWidth={860}
                                    aria-label={`Plusquamperfekt answer ${row.sentenceIndex + 1}`}
                                    enableHint={true}
                                    hintValue={row.answer}
                                />
                            </li>
                        );
                    }}
            </SectionedProgressiveList>
        </div>
    );
}

Plusquamperfekt.headerButton = (
    <button
        type="button"
        className="hint-button"
        onClick={() => document.dispatchEvent(new CustomEvent("show-hint"))}
    >
        !
    </button>
);

Plusquamperfekt.instructions = data.instructions;
Plusquamperfekt.title = data.title;
