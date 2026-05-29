import FillInExercise from "../../components/FillInExercise";

import data from "../../../data/A1-1/haben-sein.json";
import hint from "../../../data/A1-1/images/haben-sein.html?raw";

const STORAGE_KEY = "haben-sein-answers";
const SLIDES_BY_LOCALE = { ru: [hint], en: [hint] };

function HabenOderSein() {
    return (
        <FillInExercise
            data={data}
            storageKey={STORAGE_KEY}
            fallbackId="haben-sein"
            slidesByLocale={SLIDES_BY_LOCALE}
            sectioned={false}
            inputClassName="input"
            inputSizes={{
                blank: {
                    minWidth: 110,
                    maxWidth: 240,
                },
            }}
            buildAnswerKey={(row) => `${row.sentenceIndex}`}
            ariaLabel="Haben oder Sein"
        />
    );
}

HabenOderSein.hasHint = true;
HabenOderSein.instructions = data.instructions;
HabenOderSein.title = data.title;
export default HabenOderSein;
