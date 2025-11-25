import { useState, useEffect } from "react";
import { useLocale } from "../../contexts/LocaleContext";
import data from "../../../data/A1-1/posessive_pronouns.json";
import ModalImage from "../../components/ModalImage";
import Sidebar from "../../components/Sidebar";
import "../../css/A1-1/PossessivePronouns.css";
import casesImage from "../../../data/A1-1/images/posessive_pronouns.png";

function PossessivePronouns() {
    const STORAGE_KEY = "possessive-pronouns-answers";
    const { locale } = useLocale();

    const [answers, setAnswers] = useState(() => {
        try {
            const saved = localStorage.getItem(STORAGE_KEY);
            return saved ? JSON.parse(saved) : {};
        } catch {
            return {};
        }
    });

    const [showImage, setShowImage] = useState(false);

    useEffect(() => {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(answers));
    }, [answers]);

    useEffect(() => {
        const handleClear = () => {
            setAnswers({});
        };

        window.addEventListener("clear-possessive-pronouns-answers", handleClear);
        return () => {
            window.removeEventListener("clear-possessive-pronouns-answers", handleClear);
        };
    }, []);

    useEffect(() => {
        const handleShowHint = () => {
            setShowImage(true);
        };

        document.addEventListener("show-possessive-hint", handleShowHint);
        return () => {
            document.removeEventListener("show-possessive-hint", handleShowHint);
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
            <li key={sentenceIdx} className="article-declension-list-item">
                {parts.map((part, idx) => {
                    const key = `${sentenceIdx}-${idx}`;
                    const inputValue = answers[key]?.value || "";
                    const isCorrect = answers[key]?.isCorrect;

                    let inputClass = "article-declension-input";
                    if (inputValue !== "") {
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
        <div>
            {showImage && (
                <ModalImage
                    src={casesImage}
                    alt="Case chart"
                    onClose={() => setShowImage(false)}
                />
            )}

            <ul className="article-declension-list">
                {data.items.map((item, idx) =>
                    renderSentence(item.sentence, item.answer, idx)
                )}
            </ul>
        </div>
    );
}

PossessivePronouns.headerButton = (
    <button
        onClick={() => document.dispatchEvent(new CustomEvent("show-possessive-hint"))}
        className="hint-button"
    >
        !
    </button>
);

PossessivePronouns.instructions = data.instructions;
PossessivePronouns.title = data.title;
export default PossessivePronouns;
