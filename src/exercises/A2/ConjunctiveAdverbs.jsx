import FillInExercise from "../../components/FillInExercise";

import data from "../../../data/A2/conjunctiveAdverbs.json";
import hintRu from "../../../data/A2/images/conjunctiveAdverbs.html?raw";
import hintEn from "../../../data/A2/images/en/conjunctiveAdverbs.html?raw";

const STORAGE_KEY = "conjunctive-adverbs-answers";
const SLIDES_BY_LOCALE = { ru: [hintRu], en: [hintEn] };

export default function ConjunctiveAdverbs() {
    return (
        <FillInExercise
            data={data}
            storageKey={STORAGE_KEY}
            fallbackId="conjunctive-adverbs"
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

ConjunctiveAdverbs.hasHint = true;
ConjunctiveAdverbs.instructions = data.instructions;
ConjunctiveAdverbs.title = data.title;
