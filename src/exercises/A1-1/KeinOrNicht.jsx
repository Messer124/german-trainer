import { useEffect, useRef, useState } from "react";
import { Eye } from "lucide-react";
import data from "../../../data/A1-1/kein-nicht.json";
import "../../css/exercises/Common.css";
import hint from "../../../data/A1-1/images/kein-nicht.html?raw";
import { usePersistentAnswers } from "../../hooks/usePersistentAnswers";
import ModalHtml from "../../components/ModalHtml";
import ExpandingInput from "../../components/ExpandingInput";

const STORAGE_KEY = "keinOrNicht-sentences-answers";

function KeinOrNichtSentences() {
    const [showImage, setShowImage] = useState(false);
    const [answers, setAnswers] = usePersistentAnswers(STORAGE_KEY, {});
    const [previewValues, setPreviewValues] = useState({});
    const previewTimersRef = useRef({});

    useEffect(() => {
        const handleShowHint = () => {
            setShowImage(true);
        };

        document.addEventListener("show-hint", handleShowHint);
        return () => {
            document.removeEventListener("show-hint", handleShowHint);
        };
    }, []);

    useEffect(() => {
        return () => {
            Object.values(previewTimersRef.current).forEach((id) => clearTimeout(id));
        };
    }, []);

    const handleChange = (index, value) => {
        const correct = data.items[index].answer.trim().toLowerCase();
        const isCorrect = value.trim().toLowerCase() === correct;
        const key = `keinOrNicht-${index}`;

        if (previewTimersRef.current[key]) {
            clearTimeout(previewTimersRef.current[key]);
            delete previewTimersRef.current[key];
        }
        if (previewValues[key] != null) {
            setPreviewValues((prev) => {
                const next = { ...prev };
                delete next[key];
                return next;
            });
        }

        setAnswers((prev) => ({
            ...prev,
            [key]: {
                value,
                isCorrect
            }
        }));
    };

    const showAnswerPreview = (index) => {
        const key = `keinOrNicht-${index}`;
        const answer = String(data.items[index]?.answer ?? "");
        if (!answer) return;

        if (previewTimersRef.current[key]) {
            clearTimeout(previewTimersRef.current[key]);
        }

        setPreviewValues((prev) => ({ ...prev, [key]: answer }));

        previewTimersRef.current[key] = setTimeout(() => {
            setPreviewValues((prev) => {
                const next = { ...prev };
                delete next[key];
                return next;
            });
            delete previewTimersRef.current[key];
        }, 2000);
    };

    return (
        <div className="exercise-inner">
            {showImage && (
                <ModalHtml
                    html={hint}
                    onClose={() => setShowImage(false)}
                />
            )}
            <div className="scroll-container">
                <ul className="list">
                    {data.items.map((item, index) => {
                        const key = `keinOrNicht-${index}`;
                        const value = answers[key]?.value ?? "";
                        const visibleValue = previewValues[key] ?? value;
                        const isCorrect = answers[key]?.isCorrect;

                        return (
                            <li key={index}>
                                <span className="sentence">{item.sentence}</span>
                                <ExpandingInput
                                    type="text"
                                    className={`autosize-input ${
                                        !answers[key] || answers[key].value === ""
                                            ? ""
                                            : isCorrect
                                                ? "correct"
                                                : "incorrect"
                                    }`}
                                    value={visibleValue}
                                    onChange={(e) => handleChange(index, e.target.value)}
                                    readOnly={previewValues[key] != null}
                                    minWidth={140}
                                    maxWidth={760}
                                />
                                <button
                                    type="button"
                                    className="eye-container eye-container--button"
                                    onClick={() => showAnswerPreview(index)}
                                    aria-label={`Show answer for sentence ${index + 1}`}
                                >
                                    <span><Eye size={18} /></span>
                                </button>
                            </li>
                        );
                    })}
                </ul>
            </div>
        </div>
    );
}

KeinOrNichtSentences.headerButton = (
    <button
        onClick={() => document.dispatchEvent(new CustomEvent("show-hint"))}
        className="hint-button"
    >
        !
    </button>
);

KeinOrNichtSentences.instructions = data.instructions;
KeinOrNichtSentences.title = data.title;
export default KeinOrNichtSentences;
