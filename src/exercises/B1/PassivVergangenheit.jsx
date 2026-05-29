import FillInExercise from "../../components/FillInExercise";

import data from "../../../data/B1/passivVergangenheit.json";
import slide1Ru from "../../../data/B1/images/passivVergangenheit1.html?raw";
import slide2Ru from "../../../data/B1/images/passivVergangenheit2.html?raw";
import slide3Ru from "../../../data/B1/images/passivVergangenheit3.html?raw";
import slide4Ru from "../../../data/B1/images/passivVergangenheit4.html?raw";
import slide1En from "../../../data/B1/images/en/passivVergangenheit1.html?raw";
import slide2En from "../../../data/B1/images/en/passivVergangenheit2.html?raw";
import slide3En from "../../../data/B1/images/en/passivVergangenheit3.html?raw";
import slide4En from "../../../data/B1/images/en/passivVergangenheit4.html?raw";

const STORAGE_KEY = "b1-passiv-vergangenheit-answers";
const SLIDES_BY_LOCALE = {
    ru: [slide1Ru, slide2Ru, slide3Ru, slide4Ru],
    en: [slide1En, slide2En, slide3En, slide4En],
};

export default function PassivVergangenheit() {
    return (
        <FillInExercise
            data={data}
            storageKey={STORAGE_KEY}
            fallbackId="b1-passiv-vergangenheit"
            slidesByLocale={SLIDES_BY_LOCALE}
            inputSizes={{
                full: {
                    minWidth: 300,
                    mobileMinWidth: 140,
                    tabletMinWidth: 210,
                    maxWidth: 800,
                },
                blank: {
                    minWidth: 95,
                    mobileMinWidth: 65,
                    tabletMinWidth: 80,
                    maxWidth: 240,
                },
            }}
            buildAnswerKey={(row) => `b1-passiv-vergangenheit-${row.answerKey}`}
            ariaLabel="Passiv Vergangenheit"
        />
    );
}

PassivVergangenheit.hasHint = true;
PassivVergangenheit.instructions = data.instructions;
PassivVergangenheit.title = data.title;
