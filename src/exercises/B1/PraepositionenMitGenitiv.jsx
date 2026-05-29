import FillInExercise from "../../components/FillInExercise";

import data from "../../../data/B1/praepositionenMitGenitiv.json";
import slide1Ru from "../../../data/B1/images/praepositionenMitGenitiv-1.html?raw";
import slide2Ru from "../../../data/B1/images/praepositionenMitGenitiv-2.html?raw";
import slide3Ru from "../../../data/B1/images/praepositionenMitGenitiv-3.html?raw";
import slide1En from "../../../data/B1/images/en/praepositionenMitGenitiv-1.html?raw";
import slide2En from "../../../data/B1/images/en/praepositionenMitGenitiv-2.html?raw";
import slide3En from "../../../data/B1/images/en/praepositionenMitGenitiv-3.html?raw";

const STORAGE_KEY = "praepositionen-mit-genitiv-answers";
const SLIDES_BY_LOCALE = {
    ru: [slide1Ru, slide2Ru, slide3Ru],
    en: [slide1En, slide2En, slide3En],
};

export default function PraepositionenMitGenitiv() {
    return (
        <FillInExercise
            data={data}
            storageKey={STORAGE_KEY}
            fallbackId="praepositionen-mit-genitiv"
            slidesByLocale={SLIDES_BY_LOCALE}
            sectioned={false}
            inputSizes={{
                full: {
                    minWidth: 200,
                    mobileMinWidth: 150,
                    tabletMinWidth: 240,
                    maxWidth: 920,
                },
            }}
            buildAnswerKey={(row) => `${row.sentenceIndex}`}
            ariaLabel="Präpositionen mit Genitiv"
        />
    );
}

PraepositionenMitGenitiv.hasHint = true;
PraepositionenMitGenitiv.instructions = data.instructions;
PraepositionenMitGenitiv.title = data.title;
