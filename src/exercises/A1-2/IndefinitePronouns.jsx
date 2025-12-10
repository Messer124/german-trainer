import { useEffect, useState } from "react";
import ModalImage from "../../components/ModalImage";
import { usePersistentAnswers } from "../../hooks/usePersistentAnswers";
import data from "../../../data/A1-2/indefinitePronouns.json"
import hintImage from "../../../data/A1-2/images/indefinitePronouns.png";
import "../../css/exercises/Common.css";

const STORAGE_KEY = "indefinite-pronouns-answers";

function IndefinitePronouns() {
    const [answers, setAnswers] = usePersistentAnswers(STORAGE_KEY, {});
    const [showImage, setShowImage] = useState(false);

    useEffect(() => {
        const handleShowHint = () => setShowImage(true);

        document.addEventListener("show-hint", handleShowHint);
        return () => {
            document.removeEventListener("show-hint", handleShowHint);
        };
    }, []);

    const getAnswerArray = (sentenceIdx) => {
        const raw = data.items[sentenceIdx].answer || "";

        return raw
            .split(",")
            .map((part) => part.trim())
            .filter(Boolean); // убираем пустые
    };

    const handleChange = (sentenceIdx, blankIdx, value) => {
        const answersForSentence = getAnswerArray(sentenceIdx).map((a) =>
            a.toLowerCase()
        );
        const correct = answersForSentence[blankIdx] || "";

        const key = `${sentenceIdx}-${blankIdx}`;

        setAnswers((prev) => ({
            ...prev,
            [key]: {
                value,
                isCorrect: value.trim().toLowerCase() === correct,
            },
        }));
    };

    const renderSentence = (item, sentenceIdx) => {
        const parts = item.sentence.split("___"); // как в ArticleDeclension
        const answerArray = getAnswerArray(sentenceIdx);

        return (
            <li key={sentenceIdx} className="list-item">
                {parts.map((part, idx) => {
                    const key = `${sentenceIdx}-${idx}`;
                    const inputValue = answers[key]?.value || "";
                    const isCorrect = answers[key]?.isCorrect;

                    let inputClass = "input";
                    if (inputValue.trim() !== "") {
                        inputClass += isCorrect ? " correct" : " incorrect";
                    }

                    return (
                        <span key={idx}>
              {part}
                            {idx < answerArray.length && (
                                <input
                                    type="text"
                                    value={inputValue}
                                    onChange={(e) =>
                                        handleChange(sentenceIdx, idx, e.target.value)
                                    }
                                    className={inputClass}
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
                <ModalImage
                    src={hintImage}
                    alt={data.title?.ru || "Indefinite pronouns"}
                    onClose={() => setShowImage(false)}
                />
            )}

            <div className="scroll-container">
                <ul className="list">
                    {data.items.map((item, idx) => renderSentence(item, idx))}
                </ul>
            </div>
        </div>
    );
}

IndefinitePronouns.headerButton = (
    <button
        type="button"
        className="hint-button"
        onClick={() => document.dispatchEvent(new CustomEvent("show-hint"))}
    >
        !
    </button>
);

IndefinitePronouns.instructions = data.instructions;
IndefinitePronouns.title = data.title;

export default IndefinitePronouns;