import { useState, useEffect } from "react";
import { useLocale } from "../../contexts/LocaleContext";
import PageHeader from "../../components/PageHeader";
import "./../../css/A1/ModalVerbExercise.css";

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

export default function ModalVerbExercise() {
    const { locale } = useLocale();

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
            <PageHeader title={data.title[locale]}>
                {data.instructions[locale]}
            </PageHeader>

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