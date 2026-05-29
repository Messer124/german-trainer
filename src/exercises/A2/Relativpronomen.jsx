import FillInExercise from "../../components/FillInExercise";

import data from "../../../data/A2/relativpronomen.json";
import slide1Ru from "../../../data/A2/images/relativpronomen.html?raw";
import slide2Ru from "../../../data/A2/images/articles.html?raw";
import slide1En from "../../../data/A2/images/en/relativpronomen.html?raw";
import slide2En from "../../../data/A2/images/en/articles.html?raw";

const STORAGE_KEY = "relativpronomen-answers";
const SLIDES_BY_LOCALE = {
    ru: [slide1Ru, slide2Ru],
    en: [slide1En, slide2En],
};

export default function Relativpronomen() {
    return (
        <FillInExercise
            data={data}
            storageKey={STORAGE_KEY}
            fallbackId="relativpronomen"
            slidesByLocale={SLIDES_BY_LOCALE}
            sectioned={false}
            inputClassName="input"
            inputSizes={{
                blank: {
                    minWidth: 100,
                    maxWidth: 220,
                },
            }}
            buildAnswerKey={(row) => `${row.sentenceIndex}`}
            hintMode="first"
            ariaLabel="Relativpronomen"
        />
    );
}

Relativpronomen.hasHint = true;
Relativpronomen.instructions = data.instructions;
Relativpronomen.title = data.title;
