import FillInExercise from "../../components/FillInExercise";

import data from "../../../data/A1-2/time.json";
import hintRu from "../../../data/A1-2/images/timeRules.html?raw";
import hintEn from "../../../data/A1-2/images/en/timeRules.html?raw";

const STORAGE_KEY = "time-answers";
const SLIDES_BY_LOCALE = { ru: [hintRu], en: [hintEn] };

function TimeExercise() {
    return (
        <FillInExercise
            data={data}
            storageKey={STORAGE_KEY}
            fallbackId="time"
            slidesByLocale={SLIDES_BY_LOCALE}
            sectioned={false}
            sentenceField="time"
            inputClassName="input"
            inputSizes={{
                full: {
                    minWidth: 160,
                    maxWidth: 360,
                },
            }}
            buildAnswerKey={(row) => `${row.sentenceIndex}`}
            hintMode="first"
            ariaLabel="Time"
        />
    );
}

TimeExercise.hasHint = true;
TimeExercise.instructions = data.instructions;
TimeExercise.title = data.title;
export default TimeExercise;
