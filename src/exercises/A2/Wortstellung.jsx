import FillInExercise from "../../components/FillInExercise";

import data from "../../../data/A2/wortstellung.json";
import hintRu from "../../../data/A2/images/wortstellung.html?raw";
import hintEn from "../../../data/A2/images/en/wortstellung.html?raw";

const STORAGE_KEY = "wortstellung-answers";
const SLIDES_BY_LOCALE = { ru: [hintRu], en: [hintEn] };

export default function Wortstellung() {
    return (
        <FillInExercise
            data={data}
            storageKey={STORAGE_KEY}
            fallbackId="wortstellung"
            slidesByLocale={SLIDES_BY_LOCALE}
            sectioned={false}
            inputSizes={{
                full: {
                    minWidth: 180,
                    maxWidth: 720,
                },
            }}
            buildAnswerKey={(row) => `wortstellung-${row.sentenceIndex}`}
            separator=""
            hintMode="first"
            ariaLabel="Wortstellung"
        />
    );
}

Wortstellung.hasHint = true;
Wortstellung.instructions = data.instructions;
Wortstellung.title = data.title;
