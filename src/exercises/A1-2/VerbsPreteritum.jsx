
import { useEffect, useMemo, useRef, useState } from "react";
import { Eye } from "lucide-react";
import ModalHtml from "../../components/ModalHtml";
import ExpandingInput from "../../components/ExpandingInput";
import { usePersistentAnswers } from "../../hooks/usePersistentAnswers";
import data from "../../../data/A1-2/verbsPreteritum.json";
import hint from "../../../data/A1-2/images/preteritum.html?raw";
import "../../css/exercises/Common.css";

const STORAGE_KEY = "verbs-preteritum-answers";

function normalize(v) {
    return String(v ?? "").trim().toLowerCase();
}

function getCorrectAnswer(answer) {
    if (Array.isArray(answer)) return String(answer[0] ?? "");
    return String(answer ?? "");
}

export default function VerbsPreteritum() {
    const [answers, setAnswers] = usePersistentAnswers(STORAGE_KEY, {});
    const [showHint, setShowHint] = useState(false);
    const [previewValues, setPreviewValues] = useState({});
    const previewTimersRef = useRef({});

    const items = useMemo(() => (Array.isArray(data.items) ? data.items : []), []);

    useEffect(() => {
        const handleShowHint = () => setShowHint(true);
        document.addEventListener("show-hint", handleShowHint);
        return () => document.removeEventListener("show-hint", handleShowHint);
    }, []);

    useEffect(() => {
        return () => {
            Object.values(previewTimersRef.current).forEach((id) => clearTimeout(id));
        };
    }, []);

    const handleChange = (index, value) => {
        const correct = normalize(getCorrectAnswer(items[index]?.answer));
        const isCorrect = normalize(value) === correct;

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

        setAnswers((prev) => ({
            ...prev,
            [index]: { value, isCorrect },
        }));
    };

    const showAnswerPreview = (index, answerText) => {
        if (!answerText) return;

        if (previewTimersRef.current[index]) {
            clearTimeout(previewTimersRef.current[index]);
        }

        setPreviewValues((prev) => ({ ...prev, [index]: answerText }));

        previewTimersRef.current[index] = setTimeout(() => {
            setPreviewValues((prev) => {
                const next = { ...prev };
                delete next[index];
                return next;
            });
            delete previewTimersRef.current[index];
        }, 2000);
    };

    return (
        <div className="exercise-inner">
            {showHint && <ModalHtml html={hint} onClose={() => setShowHint(false)} />}

            <div className="scroll-container">
                <ul className="list">
                    {items.map((item, index) => {
                        const stored = answers[index];
                        const value = stored?.value ?? "";
                        const visibleValue = previewValues[index] ?? value;
                        const trimmed = visibleValue.trim();
                        const isCorrect = stored?.isCorrect;

                        const parts = String(item.sentence ?? "").split("___");
                        const left = parts[0] ?? "";
                        const right = parts[1] ?? "";

                        const correctText = getCorrectAnswer(item.answer);

                        const inputClass =
                            trimmed === ""
                                ? "input"
                                : isCorrect
                                    ? "input correct"
                                    : "input incorrect";

                        return (
                            <li key={index} className="list-item">
                                {left}

                                <ExpandingInput
                                    type="text"
                                    value={visibleValue}
                                    onChange={(e) => handleChange(index, e.target.value)}
                                    className={inputClass}
                                    placeholder={item.verb}
                                    maxWidth={260}
                                    readOnly={previewValues[index] != null}
                                    aria-label={`Präteritum verb ${index + 1}`}
                                />

                                {right}

                                <button
                                    type="button"
                                    className="eye-container eye-container--button"
                                    title="Show answer"
                                    onClick={() => showAnswerPreview(index, correctText)}
                                    aria-label={`Show answer for item ${index + 1}`}
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

VerbsPreteritum.headerButton = (
    <button
        type="button"
        className="hint-button"
        onClick={() => document.dispatchEvent(new CustomEvent("show-hint"))}
    >
        !
    </button>
);

VerbsPreteritum.instructions = data.instructions;
VerbsPreteritum.title = data.title;
