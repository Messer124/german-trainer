import FillInExercise from "../../components/FillInExercise";

import data from "../../../data/A1-2/prepositionsPlace.json";
import hintRu from "../../../data/A1-2/images/prepositionsPlace.html?raw";
import hintEn from "../../../data/A1-2/images/en/prepositionsPlace.html?raw";

const STORAGE_KEY = "prepositions-place-answers";
const SLIDES_BY_LOCALE = { ru: [hintRu], en: [hintEn] };

export default function Prepositions() {
    return (
        <FillInExercise
            data={data}
            storageKey={STORAGE_KEY}
            fallbackId="prepositions-place"
            slidesByLocale={SLIDES_BY_LOCALE}
            sectioned={false}
            multiBlank
            inputClassName="input"
            inputSizes={{
                blank: {
                    minWidth: 110,
                    maxWidth: 260,
                },
            }}
            ariaLabel="Prepositions place"
        />
    );
}

Prepositions.hasHint = true;
Prepositions.instructions = data.instructions;
Prepositions.title = data.title;
