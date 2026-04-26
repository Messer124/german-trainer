import { useEffect, useState } from "react";
import data from "../../../data/A1-1/kein-nicht.json";
import "../../css/exercises/Common.css";
import { useLocale } from "../../contexts/LocaleContext";
import hintRu from "../../../data/A1-1/images/kein-nicht.html?raw";
import hintEn from "../../../data/A1-1/images/en/kein-nicht.html?raw";
import { usePersistentAnswers } from "../../hooks/usePersistentAnswers";
import ModalHtml from "../../components/ModalHtml";
import ExpandingInput from "../../components/ExpandingInput";
import ProgressiveList from "../../components/ProgressiveList";

const STORAGE_KEY = "keinOrNicht-sentences-answers";

function KeinOrNichtSentences() {
    const { locale } = useLocale();
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
                    html={locale === "en" ? hintEn : hintRu}
                    onClose={() => setShowImage(false)}
                />
            )}
            <div className="scroll-container">
                <ProgressiveList items={data.items} className="list">
                    {(item, index) => {
                        const key = `keinOrNicht-${index}`;
                        const value = answers[key]?.value ?? "";
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
                                    value={value}
                                    onChange={(e) => handleChange(index, e.target.value)}
                                    minWidth={140}
                                    maxWidth={760}
                                    enableHint={true}
                                    hintValue={item.answer}
                                />
                            </li>
                        );
                    }}
                </ProgressiveList>
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
