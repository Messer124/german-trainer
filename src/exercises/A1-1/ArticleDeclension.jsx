import { useState, useEffect } from "react";
import data from "../../../data/A1-1/articleDeclension.json";
import ModalHtml from "../../components/ModalHtml";
import ExpandingInput from "../../components/ExpandingInput";
import "../../css/exercises/Common.css";
import { useLocale } from "../../contexts/LocaleContext";
import hintRu from "../../../data/A1-1/images/cases.html?raw";
import hintEn from "../../../data/A1-1/images/en/cases.html?raw";
import { usePersistentAnswers } from "../../hooks/usePersistentAnswers";

const STORAGE_KEY = "articles-answers";

function ArticleDeclension() {
    const { locale } = useLocale();
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
            <li key={sentenceIdx} className="list-item">
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
                    html={locale === "en" ? hintEn : hintRu}
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

ArticleDeclension.headerButton = (
    <button
        onClick={() => document.dispatchEvent(new CustomEvent("show-hint"))}
        className="hint-button"
    >
        !
    </button>
);

ArticleDeclension.instructions = data.instructions;
ArticleDeclension.title = data.title;
export default ArticleDeclension;
