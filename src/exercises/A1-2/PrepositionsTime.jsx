import FillInExercise from "../../components/FillInExercise";

import data from "../../../data/A1-2/prepositionsTime.json";
import hint from "../../../data/A1-2/images/prepositionsTime.html?raw";
import hint2Ru from "../../../data/A1-2/images/prepositionsTime2.html?raw";
import hint2En from "../../../data/A1-2/images/en/prepositionsTime2.html?raw";

const STORAGE_KEY = "prepositions-time-answers";
const SLIDES_BY_LOCALE = {
    ru: [hint, hint2Ru],
    en: [hint, hint2En],
};

export default function PrepositionsTime() {
    return (
        <FillInExercise
            data={data}
            storageKey={STORAGE_KEY}
            fallbackId="prepositions-time"
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
            ariaLabel="Prepositions time"
        />
    );
}

PrepositionsTime.hasHint = true;
PrepositionsTime.instructions = data.instructions;
PrepositionsTime.title = data.title;
