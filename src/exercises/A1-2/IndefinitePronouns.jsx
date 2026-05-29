import FillInExercise from "../../components/FillInExercise";

import data from "../../../data/A1-2/indefinitePronouns.json";
import hintRu from "../../../data/A1-2/images/indefinitePronouns.html?raw";
import hintEn from "../../../data/A1-2/images/en/indefinitePronouns.html?raw";

const STORAGE_KEY = "indefinite-pronouns-answers";
const SLIDES_BY_LOCALE = { ru: [hintRu], en: [hintEn] };

export default function IndefinitePronouns() {
    return (
        <FillInExercise
            data={data}
            storageKey={STORAGE_KEY}
            fallbackId="indefinite-pronouns"
            slidesByLocale={SLIDES_BY_LOCALE}
            sectioned={false}
            inputClassName="input"
            inputSizes={{
                blank: {
                    minWidth: 120,
                    maxWidth: 320,
                },
            }}
            buildAnswerKey={(row) => `${row.sentenceIndex}`}
            hintMode="first"
            ariaLabel="Indefinite pronouns"
        />
    );
}

IndefinitePronouns.hasHint = true;
IndefinitePronouns.instructions = data.instructions;
IndefinitePronouns.title = data.title;
