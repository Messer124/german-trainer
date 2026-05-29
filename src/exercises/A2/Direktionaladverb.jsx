import FillInExercise from "../../components/FillInExercise";

import data from "../../../data/A2/direktionaladverb.json";
import slide1Ru from "../../../data/A2/images/adverbien.html?raw";
import slide2Ru from "../../../data/A2/images/prefixes.html?raw";
import slide1En from "../../../data/A2/images/en/adverbien.html?raw";
import slide2En from "../../../data/A2/images/en/prefixes.html?raw";

const STORAGE_KEY = "adverbien-answers";
const SLIDES_BY_LOCALE = {
    ru: [slide1Ru, slide2Ru],
    en: [slide1En, slide2En],
};

export default function Direktionaladverb() {
    return (
        <FillInExercise
            data={data}
            storageKey={STORAGE_KEY}
            fallbackId="adverbien"
            slidesByLocale={SLIDES_BY_LOCALE}
            sectioned={false}
            inputClassName="input direktionaladverb-input"
            inputSizes={{
                full: {
                    minWidth: 140,
                    maxWidth: 460,
                    mobileMinWidth: 120,
                },
            }}
            buildAnswerKey={(row) => `${row.sentenceIndex}`}
            hintMode="first"
            listItemClassName="list-item direktionaladverb-item"
            sentenceClassName="sentence direktionaladverb-sentence"
            ariaLabel="Adverbien"
        />
    );
}

Direktionaladverb.hasHint = true;
Direktionaladverb.title = data.title;
Direktionaladverb.instructions = data.instructions;
