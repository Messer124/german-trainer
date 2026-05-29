import FillInExercise from "../../components/FillInExercise";

import data from "../../../data/A1-2/habenSeinPreteritum.json";
import hintRu from "../../../data/A1-2/images/habenSeinPreteritum.html?raw";

const STORAGE_KEY = "haben-sein-preteritum-answers";
const SLIDES_BY_LOCALE = { ru: [hintRu], en: [hintRu] };

function HabenSeinPreteritum() {
    return (
        <FillInExercise
            data={data}
            storageKey={STORAGE_KEY}
            fallbackId="haben-sein-preteritum"
            slidesByLocale={SLIDES_BY_LOCALE}
            sectioned={false}
            inputClassName="input"
            inputSizes={{
                blank: {
                    minWidth: 120,
                    maxWidth: 260,
                },
            }}
            buildAnswerKey={(row) => `${row.sentenceIndex}`}
            hintMode="first"
            ariaLabel="Haben Sein Preteritum"
        />
    );
}

HabenSeinPreteritum.hasHint = true;
HabenSeinPreteritum.instructions = data.instructions;
HabenSeinPreteritum.title = data.title;
export default HabenSeinPreteritum;
