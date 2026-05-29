import FillInExercise from "../../components/FillInExercise";

import data from "../../../data/B1/konjunktiv2.json";
import slide1Ru from "../../../data/B1/images/konjunktiv2-1.html?raw";
import slide2Ru from "../../../data/B1/images/konjunktiv2-2.html?raw";
import slide3Ru from "../../../data/B1/images/konjunktiv2-3.html?raw";
import slide4Ru from "../../../data/B1/images/konjunktiv2-4.html?raw";
import slide1En from "../../../data/B1/images/en/konjunktiv2-1.html?raw";
import slide2En from "../../../data/B1/images/en/konjunktiv2-2.html?raw";
import slide3En from "../../../data/B1/images/en/konjunktiv2-3.html?raw";
import slide4En from "../../../data/B1/images/en/konjunktiv2-4.html?raw";

const STORAGE_KEY = "b1-konjunktiv2-answers";
const SLIDES_BY_LOCALE = {
    ru: [slide1Ru, slide2Ru, slide3Ru, slide4Ru],
    en: [slide1En, slide2En, slide3En, slide4En],
};

export default function Konjunktiv2() {
    return (
        <FillInExercise
            data={data}
            storageKey={STORAGE_KEY}
            fallbackId="b1-konjunktiv2"
            slidesByLocale={SLIDES_BY_LOCALE}
            inputSizes={{
                full: {
                    minWidth: 260,
                    mobileMinWidth: 130,
                    tabletMinWidth: 190,
                    maxWidth: 760,
                },
            }}
            buildAnswerKey={(row) => `b1-konjunktiv2-${row.sentenceIndex}`}
            ariaLabel="Konjunktiv II"
        />
    );
}

Konjunktiv2.hasHint = true;
Konjunktiv2.instructions = data.instructions;
Konjunktiv2.title = data.title;
