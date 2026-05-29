import FillInExercise from "../../components/FillInExercise";

import data from "../../../data/B1/konjunktionen.json";
import slide1Ru from "../../../data/B1/images/konjunktionen-1.html?raw";
import slide2Ru from "../../../data/B1/images/konjunktionen-2.html?raw";
import slide1En from "../../../data/B1/images/en/konjunktionen-1.html?raw";
import slide2En from "../../../data/B1/images/en/konjunktionen-2.html?raw";

const STORAGE_KEY = "konjunktionen-answers";
const SLIDES_BY_LOCALE = {
    ru: [slide1Ru, slide2Ru],
    en: [slide1En, slide2En],
};

export default function Konjunktionen() {
    return (
        <FillInExercise
            data={data}
            storageKey={STORAGE_KEY}
            fallbackId="konjunktionen"
            slidesByLocale={SLIDES_BY_LOCALE}
            inputSizes={{
                full: {
                    minWidth: 340,
                    mobileMinWidth: 150,
                    tabletMinWidth: 240,
                    maxWidth: 900,
                },
                blank: {
                    minWidth: 95,
                    mobileMinWidth: 65,
                    tabletMinWidth: 80,
                    maxWidth: 220,
                },
            }}
            normalizeOptions={{ stripFinalPunctuation: true }}
            buildAnswerKey={(row) => `konjunktionen-${row.answerKey}`}
            ariaLabel="Konjunktionen"
        />
    );
}

Konjunktionen.hasHint = true;
Konjunktionen.instructions = data.instructions;
Konjunktionen.title = data.title;
