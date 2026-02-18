import { useState, useEffect } from "react";
import data from "../../../data/A1-1/posessive_pronouns.json";
import ModalHtml from "../../components/ModalHtml";
import ExpandingInput from "../../components/ExpandingInput";
import "../../css/exercises/Common.css";
import hint from "../../../data/A1-1/images/posessive_pronouns.html?raw";
import { usePersistentAnswers } from "../../hooks/usePersistentAnswers";

const STORAGE_KEY = "possessive-pronouns-answers";

function PossessivePronouns() {
    const [answers, setAnswers] = usePersistentAnswers(STORAGE_KEY, {});
    const [showImage, setShowImage] = useState(false);

    useEffect(() => {
        const handleShowHint = () => {
            setShowImage(true);
        };

        document.addEventListener("show-hint", handleShowHint);
        return () => {
            document.removeEventListener("show-hint", handleShowHint);
        };
    }, []);

    const handleChange = (sentenceIdx, blankIdx, value) => {
        const correct = data.items[sentenceIdx].answer[blankIdx]?.toLowerCase();
        const key = `${sentenceIdx}-${blankIdx}`;
        setAnswers((prev) => ({
            ...prev,
            [key]: {
                value,
                isCorrect: value.trim().toLowerCase() === correct,
            },
        }));
    };

    const renderSentence = (sentence, answerArray, sentenceIdx) => {
        const parts = sentence.split("___");

        return (
            <li key={sentenceIdx}>
                {parts.map((part, idx) => {
                    const key = `${sentenceIdx}-${idx}`;
                    const inputValue = answers[key]?.value || "";
                    const isCorrect = answers[key]?.isCorrect;

                    let inputClass = "input";
                    if (inputValue !== "") {
                        inputClass += isCorrect ? " correct" : " incorrect";
                    }

                    return (
                        <span key={idx}>
              {part}
                            {idx < answerArray.length && (
                                <ExpandingInput
                                    type="text"
                                    value={inputValue}
                                    onChange={(e) =>
                                        handleChange(sentenceIdx, idx, e.target.value)
                                    }
                                    className={inputClass}
                                    minWidth={110}
                                    maxWidth={260}
                                />
                            )}
            </span>
                    );
                })}
            </li>
        );
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
                {data.items.map((item, idx) =>
                    renderSentence(item.sentence, item.answer, idx)
                )}
            </ul>
        </div>
        </div>
    );
}

PossessivePronouns.headerButton = (
    <button
        onClick={() => document.dispatchEvent(new CustomEvent("show-hint"))}
        className="hint-button"
    >
        !
    </button>
);

PossessivePronouns.instructions = data.instructions;
PossessivePronouns.title = data.title;
export default PossessivePronouns;
