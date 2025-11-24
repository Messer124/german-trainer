import { useEffect, useState } from "react";
import { Eye } from "lucide-react";
import { useLocale } from "../../contexts/LocaleContext";
import data from "../../../data/A1/kein-nicht.json";
import "../../css/A1/KeinOrNicht.css";
import ModalImage from "../../components/ModalImage";
import keinOrNichtImage from "../../../data/A1/images/kein-nicht.png";

function KeinOrNichtSentences() {
    const STORAGE_KEY = "keinOrNicht-sentences-answers";
    const { locale } = useLocale();
    const [showImage, setShowImage] = useState(false);

    const [answers, setAnswers] = useState(() => {
        const saved = localStorage.getItem(STORAGE_KEY);
        try {
            return saved ? JSON.parse(saved) : {};
        } catch {
            return {};
        }
    });

    useEffect(() => {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(answers));
    }, [answers]);

    useEffect(() => {
        const handleClear = () => {
            setAnswers({});
            localStorage.removeItem(STORAGE_KEY);
        };
        window.addEventListener("clear-keinOrNicht-sentences", handleClear);
        return () => window.removeEventListener("clear-keinOrNicht-sentences", handleClear);
    }, []);

    useEffect(() => {
        const handleShowHint = () => {
            setShowImage(true);
        };

        document.addEventListener("show-kein-nicht-hint", handleShowHint);
        return () => {
            document.removeEventListener("show-kein-nicht-hint", handleShowHint);
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
        <div className="keinOrNicht-container">
            {showImage && (
                <ModalImage
                    src={keinOrNichtImage}
                    alt={locale === "ru" ? "Подсказка: kein или nicht" : "Hint: kein or nicht"}
                    onClose={() => setShowImage(false)}
                />
            )}
            <ul className="keinOrNicht-list">
                {data.items.map((item, index) => {
                    const key = `keinOrNicht-${index}`;
                    const correct = item.answer.trim().toLowerCase();
                    const value = answers[key]?.value?.trim().toLowerCase() || "";
                    const isCorrect = value === correct;

                    return (
                        <li className="keinOrNicht-item" key={index}>
                            <span className="keinOrNicht-sentence">{item.sentence}</span>
                            <input
                                type="text"
                                className={`keinOrNicht-input ${
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
                            <span className="tooltip-container">
                                <span> <Eye size={18}/> </span>
                                <span className="tooltip">{item.answer}</span>
                            </span>
                        </li>
                    );
                })}
            </ul>
        </div>
    );
}

KeinOrNichtSentences.headerButton = (
    <button
        onClick={() => document.dispatchEvent(new CustomEvent("show-kein-nicht-hint"))}
        className="hint-button"
    >
        !
    </button>
);

KeinOrNichtSentences.instructions = data.instructions;
KeinOrNichtSentences.title = data.title;
export default KeinOrNichtSentences;