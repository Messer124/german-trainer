import FillInExercise from "../../components/FillInExercise";

import data from "../../../data/A1-2/verbsPreteritum.json";
import hintRu from "../../../data/A1-2/images/preteritum.html?raw";
import hintEn from "../../../data/A1-2/images/en/preteritum.html?raw";

const STORAGE_KEY = "verbs-preteritum-answers";
const SLIDES_BY_LOCALE = { ru: [hintRu], en: [hintEn] };

export default function VerbsPreteritum() {
    return (
        <FillInExercise
            data={data}
            storageKey={STORAGE_KEY}
            fallbackId="verbs-preteritum"
            slidesByLocale={SLIDES_BY_LOCALE}
            sectioned={false}
            placeholderField="verb"
            inputClassName="input"
            inputSizes={{
                blank: {
                    maxWidth: 260,
                },
            }}
            buildAnswerKey={(row) => `${row.sentenceIndex}`}
            hintMode="first"
            ariaLabel="Präteritum verb"
        />
    );
}

VerbsPreteritum.hasHint = true;
VerbsPreteritum.instructions = data.instructions;
VerbsPreteritum.title = data.title;
