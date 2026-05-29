import FillInExercise from "../../components/FillInExercise";

import data from "../../../data/B1/doppelkonjunktionen.json";
import slideRu from "../../../data/B1/images/doppelkonjunktionen.html?raw";
import slideEn from "../../../data/B1/images/en/doppelkonjunktionen.html?raw";

const STORAGE_KEY = "doppelkonjunktionen-answers";
const SLIDES_BY_LOCALE = { ru: [slideRu], en: [slideEn] };

export default function Doppelkonjunktionen() {
    return (
        <FillInExercise
            data={data}
            storageKey={STORAGE_KEY}
            fallbackId="doppelkonjunktionen"
            slidesByLocale={SLIDES_BY_LOCALE}
            inputSizes={{
                full: {
                    minWidth: 360,
                    mobileMinWidth: 150,
                    tabletMinWidth: 240,
                    maxWidth: 920,
                },
            }}
            normalizeOptions={{ stripFinalPunctuation: true }}
            buildAnswerKey={(row) => `doppelkonjunktionen-${row.answerKey}`}
            ariaLabel="Doppelkonjunktionen"
        />
    );
}

Doppelkonjunktionen.hasHint = true;
Doppelkonjunktionen.instructions = data.instructions;
Doppelkonjunktionen.title = data.title;
