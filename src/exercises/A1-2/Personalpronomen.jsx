import FillInExercise from "../../components/FillInExercise";

import data from "../../../data/A1-2/personalpronomen.json";
import hintRu from "../../../data/A1-2/images/personalpronomen.html?raw";
import hintEn from "../../../data/A1-2/images/en/personalpronomen.html?raw";

const STORAGE_KEY = "personal-pronouns-answers";
const SLIDES_BY_LOCALE = { ru: [hintRu], en: [hintEn] };

export default function Personalpronomen() {
    return (
        <FillInExercise
            data={data}
            storageKey={STORAGE_KEY}
            fallbackId="personalpronomen"
            slidesByLocale={SLIDES_BY_LOCALE}
            sectioned={false}
            inputSizes={{
                blank: {
                    minWidth: 70,
                    tabletMinWidth: 150,
                    mobileMinWidth: 120,
                    maxWidth: 720,
                },
            }}
            buildAnswerKey={(row) => `personalpronomen-${row.sentenceIndex}`}
            hintMode="first"
            ariaLabel="Personalpronomen"
        />
    );
}

Personalpronomen.hasHint = true;
Personalpronomen.instructions = data.instructions;
Personalpronomen.title = data.title;
