import { useEffect, useState } from "react";
import ModalHtml from "../../components/ModalHtml";
import ExpandingInput from "../../components/ExpandingInput";
import { useLocale } from "../../contexts/LocaleContext";
import { usePersistentAnswers } from "../../hooks/usePersistentAnswers";
import data from "../../../data/A1-2/personal-pronouns.json";
import hintRu from "../../../data/A1-2/images/personal-pronouns.html?raw";
import hintEn from "../../../data/A1-2/images/en/personal-pronouns.html?raw";
import "../../css/exercises/Common.css";

const STORAGE_KEY = "personal-pronouns-answers";

function renderSentenceWithBoldQuotes(sentence) {
    if (!sentence) return null;

    const segments = sentence.split(/(".*?")/g);

    return segments.map((segment, index) => {
        if (segment.startsWith('"') && segment.endsWith('"')) {
            const inner = segment.slice(1, -1);
            return (
                <strong key={index} className="sentence-quote-highlight">
                    {inner}
                </strong>
            );
        }
        return <span key={index}>{segment}</span>;
    });
}

function PersonalPronouns() {
    const { locale } = useLocale();
    const [answers, setAnswers] = usePersistentAnswers(STORAGE_KEY, {});
    const [showImage, setShowImage] = useState(false);

    useEffect(() => {
        const handleShowHint = () => setShowImage(true);

        document.addEventListener("show-hint", handleShowHint);
        return () => {
            document.removeEventListener("show-hint", handleShowHint);
        };
    }, []);

    const handleChange = (index, value) => {
        const correct = data.items[index].answer.trim().toLowerCase();
        const isCorrect = value.trim().toLowerCase() === correct;

        setAnswers((prev) => ({
            ...prev,
            [index]: { value, isCorrect },
        }));
    };

    return (
        <div>
            {showImage && (
                <ModalHtml
                    html={locale === "en" ? hintEn : hintRu}
                    onClose={() => setShowImage(false)}
                />
            )}

            <ul className="list">
                {data.items.map((item, index) => {
                    const stored = answers[index];
                    const value = stored?.value || "";
                    const trimmed = value.trim();
                    const isCorrect = stored?.isCorrect;

                    let inputClass = "input";
                    if (trimmed !== "") {
                        inputClass += isCorrect ? " correct" : " incorrect";
                    }

                    return (
                        <li className="list-item-row" key={index}>
              <span className="sentence-text">
                {renderSentenceWithBoldQuotes(item.sentence)}
              </span>

                            <ExpandingInput
                                type="text"
                                value={value}
                                onChange={(e) => handleChange(index, e.target.value)}
                                className={inputClass}
                                minWidth={120}
                                maxWidth={260}
                            />
                        </li>
                    );
                })}
            </ul>
        </div>
    );
}

PersonalPronouns.headerButton = (
    <button
        type="button"
        className="hint-button"
        onClick={() => {
            document.dispatchEvent(new CustomEvent("show-hint"));
        }}
    >
        i
    </button>
);

PersonalPronouns.instructions = data.instructions;
PersonalPronouns.title = data.title;

export default PersonalPronouns;
