import { useState, useEffect } from "react";
import "../../css/A1-1/ModalVerbExercise.css";
import image1 from "../../../data/A1-1/images/modal-verbs.png";
import image2 from "../../../data/A1-1/images/modal-verbs-2.png";
import ModalImageGallery from "../../components/ModalImageGallery";
import { usePersistentAnswers } from "../../hooks/usePersistentAnswers";

const pronouns = ["ich", "du", "er/sie/es", "wir/Sie/sie", "ihr"];
const STORAGE_KEY = "modal-verbs-answers";

const modalVerbs = {
    "müssen": ["muss", "musst", "muss", "müssen", "müsst"],
    sollen: ["soll", "sollst", "soll", "sollen", "sollt"],
    "können": ["kann", "kannst", "kann", "können", "könnt"],
    "dürfen": ["darf", "darfst", "darf", "dürfen", "dürft"],
    wollen: ["will", "willst", "will", "wollen", "wollt"],
    "möchten": ["möchte", "möchtest", "möchte", "möchten", "möchtet"],
    "mögen": ["mag", "magst", "mag", "mögen", "mögt"]
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
    const [showImage, setShowImage] = useState(false);
    const [answers, setAnswers] = usePersistentAnswers(STORAGE_KEY, {});

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
                <ModalImageGallery
                    images={[
                        { src: image1, alt: "Hint 1" },
                        { src: image2, alt: "Hint 2" },
                    ]}
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