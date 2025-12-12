import { useEffect, useState } from "react";
import { Eye } from "lucide-react";
import data from "../../../data/A1-1/kein-nicht.json";
import "../../css/exercises/Common.css";
import hint from "../../../data/A1-1/images/kein-nicht.html?raw";
import { usePersistentAnswers } from "../../hooks/usePersistentAnswers";
import ModalHtml from "../../components/ModalHtml";

const STORAGE_KEY = "keinOrNicht-sentences-answers";

function KeinOrNichtSentences() {
    const [showImage, setShowImage] = useState(false);
    const [answers, setAnswers] = usePersistentAnswers(STORAGE_KEY, {});

    useEffect(() => {
        const handleShowHint = () => {
            setShowImage(true);
        };

        document.addEventListener("show-hint", handleShowHint);
        return () => {
            document.removeEventListener("show-hint", handleShowHint);
        };
    }, []);

    const handleChange = (index, value) => {
        const correct = data.items[index].answer.trim().toLowerCase();
        const isCorrect = value.trim().toLowerCase() === correct;
        const key = `keinOrNicht-${index}`;
        setAnswers((prev) => ({
            ...prev,
            [key]: {
                value,
                isCorrect
            }
        }));
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
                        const correct = item.answer.trim().toLowerCase();
                        const value = answers[key]?.value?.trim().toLowerCase() || "";
                        const isCorrect = value === correct;

                        return (
                            <li key={index}>
                                <span className="sentence">{item.sentence}</span>
                                <input
                                    type="text"
                                    className={`autosize-input ${
                                        !answers[key] || answers[key].value === ""
                                            ? ""
                                            : isCorrect
                                                ? "correct"
                                                : "incorrect"
                                    }`}
                                    value={answers[key]?.value || ""}
                                    onChange={(e) => handleChange(index, e.target.value)}
                                    style={{
                                        width: `${Math.max(value.length + 1, 6)}ch`
                                    }}
                                />
                                <span className="eye-container">
                                    <span> <Eye size={18}/> </span>
                                    <span className="eye">{item.answer}</span>
                                </span>
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