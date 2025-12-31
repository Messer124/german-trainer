
import { useEffect, useMemo, useState } from "react";
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

    const items = useMemo(() => (Array.isArray(data.items) ? data.items : []), []);

    useEffect(() => {
        const handleShowHint = () => setShowHint(true);
        document.addEventListener("show-hint", handleShowHint);
        return () => document.removeEventListener("show-hint", handleShowHint);
    }, []);

    const handleChange = (index, value) => {
        const correct = normalize(getCorrectAnswer(items[index]?.answer));
        const isCorrect = normalize(value) === correct;

        setAnswers((prev) => ({
            ...prev,
            [index]: { value, isCorrect },
        }));
    };

    return (
        <div className="exercise-inner">
            {showHint && <ModalHtml html={hint} onClose={() => setShowHint(false)} />}

            <div className="scroll-container">
                <ul className="list">
                    {items.map((item, index) => {
                        const stored = answers[index];
                        const value = stored?.value ?? "";
                        const trimmed = value.trim();
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
                                    value={value}
                                    onChange={(e) => handleChange(index, e.target.value)}
                                    className={inputClass}
                                    placeholder={item.verb}
                                    maxWidth={260}
                                    aria-label={`Präteritum verb ${index + 1}`}
                                />

                                {right}

                                <span className="eye-container" title="Show answer">
                  <span>
                    <Eye size={18} />
                  </span>
                  <span className="eye">{correctText}</span>
                </span>
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