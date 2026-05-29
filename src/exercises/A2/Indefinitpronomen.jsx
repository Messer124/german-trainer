import FillInExercise from "../../components/FillInExercise";

import data from "../../../data/A2/indefinitpronomen.json";
import slide1Ru from "../../../data/A2/images/indefinitpronomen1.html?raw";
import slide2Ru from "../../../data/A2/images/indefinitpronomen2.html?raw";
import slide1En from "../../../data/A2/images/en/indefinitpronomen1.html?raw";
import slide2En from "../../../data/A2/images/en/indefinitpronomen2.html?raw";

const STORAGE_KEY = "indefinitpronomen-answers";
const SLIDES_BY_LOCALE = {
    ru: [slide1Ru, slide2Ru],
    en: [slide1En, slide2En],
};

export default function Indefinitpronomen() {
    return (
        <FillInExercise
            data={data}
            storageKey={STORAGE_KEY}
            fallbackId="indefinitpronomen"
            slidesByLocale={SLIDES_BY_LOCALE}
            inputSizes={{
                full: {
                    minWidth: 220,
                    tabletMinWidth: 170,
                    mobileMinWidth: 110,
                    maxWidth: 860,
                },
                blank: {
                    minWidth: 90,
                    tabletMinWidth: 75,
                    mobileMinWidth: 60,
                    maxWidth: 520,
                },
            }}
            buildAnswerKey={(row) => `indefinitpronomen-${row.sentenceIndex}`}
            hintMode="first"
            ariaLabel="Indefinitpronomen"
        />
    );
}

Indefinitpronomen.hasHint = true;
Indefinitpronomen.instructions = data.instructions;
Indefinitpronomen.title = data.title;
