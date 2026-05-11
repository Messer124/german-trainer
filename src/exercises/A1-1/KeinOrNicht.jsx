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

function normalize(value) {
    return String(value ?? "")
        .trim()
        .toLowerCase()
        .replace(/\s+/g, " ");
}

function getAcceptedAnswers(item) {
    const rawAnswer = item?.answer;
    const answers = Array.isArray(rawAnswer) ? rawAnswer : [rawAnswer];

    return answers
        .map((answer) => String(answer ?? "").trim())
        .filter(Boolean);
}

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
        const acceptedAnswers = getAcceptedAnswers(data.items[index]);
        const normalizedValue = normalize(value);
        const isCorrect = acceptedAnswers.some(
            (answer) => normalize(answer) === normalizedValue
        );
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
                        const acceptedAnswers = getAcceptedAnswers(item);

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
                                    hintValue={acceptedAnswers.join(" / ")}
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
