import FillInExercise from "../../components/FillInExercise";

import data from "../../../data/B1/steigerungVonAdjektiven.json";
import slide1Ru from "../../../data/B1/images/steigerungVonAdjektiven1.html?raw";
import slide2Ru from "../../../data/B1/images/steigerungVonAdjektiven2.html?raw";
import slide3Ru from "../../../data/B1/images/steigerungVonAdjektiven3.html?raw";
import slide4Ru from "../../../data/B1/images/steigerungVonAdjektiven4.html?raw";
import slide1En from "../../../data/B1/images/en/steigerungVonAdjektiven1.html?raw";
import slide2En from "../../../data/B1/images/en/steigerungVonAdjektiven2.html?raw";
import slide3En from "../../../data/B1/images/en/steigerungVonAdjektiven3.html?raw";
import slide4En from "../../../data/B1/images/en/steigerungVonAdjektiven4.html?raw";

const STORAGE_KEY = "steigerung-von-adjektiven-answers";
const SLIDES_BY_LOCALE = {
    ru: [slide1Ru, slide2Ru, slide3Ru, slide4Ru],
    en: [slide1En, slide2En, slide3En, slide4En],
};

export default function SteigerungVonAdjektiven() {
    return (
        <FillInExercise
            data={data}
            storageKey={STORAGE_KEY}
            fallbackId="steigerung-von-adjektiven"
            slidesByLocale={SLIDES_BY_LOCALE}
            multiBlank
            inputClassName="input"
            inputSizes={{
                blank: {
                    minWidth: 80,
                    mobileMinWidth: 35,
                    tabletMinWidth: 40,
                    maxWidth: 100,
                },
            }}
            delayedHint
            ariaLabel="Steigerung von Adjektiven"
        />
    );
}

SteigerungVonAdjektiven.hasHint = true;
SteigerungVonAdjektiven.instructions = data.instructions;
SteigerungVonAdjektiven.title = data.title;
