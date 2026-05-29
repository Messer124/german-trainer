import FillInExercise from "../../components/FillInExercise";

import data from "../../../data/A1-2/pluralNouns.json";
import hint1Ru from "../../../data/A1-2/images/pluralNouns1.html?raw";
import hint2Ru from "../../../data/A1-2/images/pluralNouns2.html?raw";
import hint1En from "../../../data/A1-2/images/en/pluralNouns1.html?raw";
import hint2En from "../../../data/A1-2/images/en/pluralNouns2.html?raw";

const STORAGE_KEY = "plural-nouns-answers";
const SLIDES_BY_LOCALE = {
    ru: [hint1Ru, hint2Ru],
    en: [hint1En, hint2En],
};

function PluralNounsExercise() {
    return (
        <FillInExercise
            data={data}
            storageKey={STORAGE_KEY}
            fallbackId="plural-nouns"
            slidesByLocale={SLIDES_BY_LOCALE}
            sectioned={false}
            sentenceField="word"
            answerField="plural"
            inputClassName="input"
            inputSizes={{
                full: {
                    minWidth: 120,
                    maxWidth: 420,
                },
            }}
            buildAnswerKey={(row) => `${row.sentenceIndex}`}
            separator=" — die"
            hintMode="first"
            ariaLabel="Plural nouns"
        />
    );
}

PluralNounsExercise.hasHint = true;
PluralNounsExercise.instructions = data.instructions;
PluralNounsExercise.title = data.title;
export default PluralNounsExercise;
