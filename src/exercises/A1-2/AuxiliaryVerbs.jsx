import FillInExercise from "../../components/FillInExercise";

import data from "../../../data/A1-2/auxiliaryVerbs.json";
import hintRu from "../../../data/A1-2/images/auxiliaryVerbs.html?raw";
import hintEn from "../../../data/A1-2/images/en/auxiliaryVerbs.html?raw";

const STORAGE_KEY = "auxiliary-verbs-answers";
const SLIDES_BY_LOCALE = { ru: [hintRu], en: [hintEn] };

export default function AuxiliaryVerbs() {
    return (
        <FillInExercise
            data={data}
            storageKey={STORAGE_KEY}
            fallbackId="auxiliary-verbs"
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
            ariaLabel="Auxiliary verb"
        />
    );
}

AuxiliaryVerbs.hasHint = true;
AuxiliaryVerbs.instructions = data.instructions;
AuxiliaryVerbs.title = data.title;
