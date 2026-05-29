import FillInExercise from "../../components/FillInExercise";

import data from "../../../data/A1-2/conjunctions.json";
import slide1Ru from "../../../data/A1-2/images/conjunctions1.html?raw";
import slide2Ru from "../../../data/A1-2/images/conjunctions2.html?raw";
import slide3Ru from "../../../data/A1-2/images/conjunctions3.html?raw";
import slide4Ru from "../../../data/A1-2/images/conjunctions4.html?raw";
import slide1En from "../../../data/A1-2/images/en/conjunctions1.html?raw";
import slide2En from "../../../data/A1-2/images/en/conjunctions2.html?raw";
import slide3En from "../../../data/A1-2/images/en/conjunctions3.html?raw";
import slide4En from "../../../data/A1-2/images/en/conjunctions4.html?raw";

const STORAGE_KEY = "conjunctions-answers";
const SLIDES_BY_LOCALE = {
    ru: [slide1Ru, slide2Ru, slide3Ru, slide4Ru],
    en: [slide1En, slide2En, slide3En, slide4En],
};

export default function Conjunctions() {
    return (
        <FillInExercise
            data={data}
            storageKey={STORAGE_KEY}
            fallbackId="conjunctions"
            slidesByLocale={SLIDES_BY_LOCALE}
            sectioned={false}
            inputClassName="input"
            inputSizes={{
                blank: {
                    minWidth: 120,
                    maxWidth: 280,
                },
            }}
            buildAnswerKey={(row) => `${row.sentenceIndex}`}
            ariaLabel="Conjunction"
        />
    );
}

Conjunctions.hasHint = true;
Conjunctions.instructions = data.instructions;
Conjunctions.title = data.title;
