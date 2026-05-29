import FillInExercise from "../../components/FillInExercise";

import data from "../../../data/A2/subordinatingConjunctions.json";
import hintRu from "../../../data/A2/images/subordinatingConjunctions.html?raw";
import hintEn from "../../../data/A2/images/en/subordinatingConjunctions.html?raw";

const STORAGE_KEY = "subordinating-conjunctions-answers";
const SLIDES_BY_LOCALE = { ru: [hintRu], en: [hintEn] };

export default function SubordinatingConjunctions() {
    return (
        <FillInExercise
            data={data}
            storageKey={STORAGE_KEY}
            fallbackId="subordinating-conjunctions"
            slidesByLocale={SLIDES_BY_LOCALE}
            sectioned={false}
            inputClassName="input"
            inputSizes={{
                blank: {
                    minWidth: 100,
                },
            }}
            buildAnswerKey={(row) => `${row.sentenceIndex}`}
            ariaLabel="Conjunction"
        />
    );
}

SubordinatingConjunctions.hasHint = true;
SubordinatingConjunctions.instructions = data.instructions;
SubordinatingConjunctions.title = data.title;
