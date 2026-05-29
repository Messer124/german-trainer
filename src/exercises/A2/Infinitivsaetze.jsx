import FillInExercise from "../../components/FillInExercise";

import data from "../../../data/A2/infinitivsaetze.json";
import slide1Ru from "../../../data/A2/images/infinitivsaetze1.html?raw";
import slide2Ru from "../../../data/A2/images/infinitivsaetze2.html?raw";
import slide3Ru from "../../../data/A2/images/infinitivsaetze3.html?raw";
import slide4Ru from "../../../data/A2/images/infinitivsaetze4.html?raw";
import slide1En from "../../../data/A2/images/en/infinitivsaetze1.html?raw";
import slide2En from "../../../data/A2/images/en/infinitivsaetze2.html?raw";
import slide3En from "../../../data/A2/images/en/infinitivsaetze3.html?raw";
import slide4En from "../../../data/A2/images/en/infinitivsaetze4.html?raw";

const STORAGE_KEY = "infinitivsaetze-answers";
const SLIDES_BY_LOCALE = {
    ru: [slide1Ru, slide2Ru, slide3Ru, slide4Ru],
    en: [slide1En, slide2En, slide3En, slide4En],
};

export default function Infinitivsaetze() {
    return (
        <FillInExercise
            data={data}
            storageKey={STORAGE_KEY}
            fallbackId="infinitivsaetze"
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
            buildAnswerKey={(row) => `infinitivsaetze-${row.sentenceIndex}`}
            hintMode="first"
            ariaLabel="Infinitivsaetze"
        />
    );
}

Infinitivsaetze.hasHint = true;
Infinitivsaetze.instructions = data.instructions;
Infinitivsaetze.title = data.title;
