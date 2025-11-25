import { useState, useEffect } from "react";
import { useLocale } from "../../contexts/LocaleContext";
import "../../css/A1-1/ModalVerbExercise.css";
import ModalImage from "../../components/ModalImage";
import modalVerbsImage from "../../../data/A1-1/images/modal-verbs.png";

const pronouns = ["ich", "du", "er/sie/es", "wir/Sie/sie", "ihr"];

const modalVerbs = {
    müssen: ["muss", "musst", "muss", "müssen", "müsst"],
    sollen: ["soll", "sollst", "soll", "sollen", "sollt"],
    können: ["kann", "kannst", "kann", "können", "könnt"],
    dürfen: ["darf", "darfst", "darf", "dürfen", "dürft"],
    wollen: ["will", "willst", "will", "wollen", "wollt"],
    möchten: ["möchte", "möchtest", "möchte", "möchten", "möchtet"],
    mögen: ["mag", "magst", "mag", "mögen", "mögt"]
};

const data = {
    title: {
        ru: "Спряжение модальных глаголов",
        en: "Modal verb conjugation"
    },
    instructions: {
        ru: "Вставьте нужную форму модального глагола",
        en: "Insert the correct form of the modal verb"
    }
};


function ModalVerbExercise() {
    const { locale } = useLocale();
    const [showImage, setShowImage] = useState(false);
    const [answers, setAnswers] = useState(() => {
        let saved = localStorage.getItem("modal-answers");
        try {
            saved = JSON.parse(saved);
        } catch (e) {
            saved = null;
        }
        return saved || {};
    });

    useEffect(() => {
        localStorage.setItem("modal-answers", JSON.stringify(answers));
    }, [answers]);

    useEffect(() => {
        const handleClear = () => setAnswers({});
        window.addEventListener("clear-modal-answers", handleClear);
        return () => window.removeEventListener("clear-modal-answers", handleClear);
    }, []);

    useEffect(() => {
        const handleShowHint = () => {
            setShowImage(true);
        };

        document.addEventListener("show-modalVerbs-hint", handleShowHint);
        return () => {
            document.removeEventListener("show-modalVerbs-hint", handleShowHint);
        };
    }, []);

    const handleChange = (pronounIdx, verb, value) => {
        const key = `${pronounIdx}-${verb}`;
        const correct = modalVerbs[verb][pronounIdx];
        setAnswers((prev) => ({
            ...prev,
            [key]: {
                value,
                isCorrect: value.trim().toLowerCase() === correct
            }
        }));
    };

    return (
        <div>

            {showImage && (
                <ModalImage
                    src={modalVerbsImage}
                    alt="Modal verb chart"
                    onClose={() => setShowImage(false)}
                />
            )}

            <table className="modal-table">
                <thead>
                <tr>
                    <th>Pronomen</th>
                    {Object.keys(modalVerbs).map((verb) => (
                        <th key={verb}>{verb}</th>
                    ))}
                </tr>
                </thead>
                <tbody>
                {pronouns.map((pronoun, i) => (
                    <tr key={pronoun}>
                        <td>{pronoun}</td>
                        {Object.keys(modalVerbs).map((verb) => {
                            const key = `${i}-${verb}`;
                            const value = answers[key]?.value || "";
                            const isCorrect = answers[key]?.isCorrect;

                            return (
                                <td key={verb}>
                                    <input
                                        type="text"
                                        value={value}
                                        onChange={(e) => handleChange(i, verb, e.target.value)}
                                        className={`modal-input ${
                                            value === "" ? "" : isCorrect ? "correct" : "incorrect"
                                        }`}
                                    />
                                </td>
                            );
                        })}
                    </tr>
                ))}
                </tbody>
            </table>
        </div>
    );
}

ModalVerbExercise.headerButton = (
    <button
        onClick={() => document.dispatchEvent(new CustomEvent("show-modalVerbs-hint"))}
        className="hint-button"
    >
        !
    </button>
);

ModalVerbExercise.instructions = data.instructions;
ModalVerbExercise.title = data.title;
export default ModalVerbExercise;