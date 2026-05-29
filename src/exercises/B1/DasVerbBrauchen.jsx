import FillInExercise from "../../components/FillInExercise";

import data from "../../../data/B1/dasVerbBrauchen.json";
import slideRu from "../../../data/B1/images/dasVerbBrauchen.html?raw";
import slideEn from "../../../data/B1/images/en/dasVerbBrauchen.html?raw";

const STORAGE_KEY = "das-verb-brauchen-answers";
const SLIDES_BY_LOCALE = { ru: [slideRu], en: [slideEn] };

export default function DasVerbBrauchen() {
    return (
        <FillInExercise
            data={data}
            storageKey={STORAGE_KEY}
            fallbackId="das-verb-brauchen"
            slidesByLocale={SLIDES_BY_LOCALE}
            inputSizes={{
                full: {
                    minWidth: 300,
                    mobileMinWidth: 140,
                    tabletMinWidth: 210,
                    maxWidth: 820,
                },
            }}
            buildAnswerKey={(row) => `das-verb-brauchen-${row.answerKey}`}
            ariaLabel="Das Verb brauchen"
        />
    );
}

DasVerbBrauchen.hasHint = true;
DasVerbBrauchen.instructions = data.instructions;
DasVerbBrauchen.title = data.title;
