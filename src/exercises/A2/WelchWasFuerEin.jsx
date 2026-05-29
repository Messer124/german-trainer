import FillInExercise from "../../components/FillInExercise";

import data from "../../../data/A2/welchWasFuerEin.json";
import slide1Ru from "../../../data/A2/images/welchWasFuerEin1.html?raw";
import slide2Ru from "../../../data/A2/images/welchWasFuerEin2.html?raw";
import slide1En from "../../../data/A2/images/en/welchWasFuerEin1.html?raw";
import slide2En from "../../../data/A2/images/en/welchWasFuerEin2.html?raw";

const STORAGE_KEY = "welch-was-fuer-ein-answers";
const SLIDES_BY_LOCALE = {
    ru: [slide1Ru, slide2Ru],
    en: [slide1En, slide2En],
};

export default function WelchWasFuerEin() {
    return (
        <FillInExercise
            data={data}
            storageKey={STORAGE_KEY}
            fallbackId="welch-was-fuer-ein"
            slidesByLocale={SLIDES_BY_LOCALE}
            sectioned={false}
            inputClassName="input"
            inputSizes={{
                blank: {
                    minWidth: 110,
                    mobileMinWidth: 60,
                    tabletMinWidth: 85,
                    maxWidth: 300,
                },
            }}
            buildAnswerKey={(row) => `${row.sentenceIndex}`}
            hintMode="first"
            ariaLabel="Welch / Was für ein"
        />
    );
}

WelchWasFuerEin.hasHint = true;
WelchWasFuerEin.instructions = data.instructions;
WelchWasFuerEin.title = data.title;
