import FillInExercise from "../../components/FillInExercise";

import data from "../../../data/A2/passivPraesens.json";
import slide1Ru from "../../../data/A2/images/passivPraesens1.html?raw";
import slide2Ru from "../../../data/A2/images/passivPraesens2.html?raw";
import slide3Ru from "../../../data/A2/images/passivPraesens3.html?raw";
import slide4Ru from "../../../data/A2/images/passivPraesens4.html?raw";
import slide1En from "../../../data/A2/images/en/passivPraesens1.html?raw";
import slide2En from "../../../data/A2/images/en/passivPraesens2.html?raw";
import slide3En from "../../../data/A2/images/en/passivPraesens3.html?raw";
import slide4En from "../../../data/A2/images/en/passivPraesens4.html?raw";

const STORAGE_KEY = "passiv-praesens-answers";
const SLIDES_BY_LOCALE = {
    ru: [slide1Ru, slide2Ru, slide3Ru, slide4Ru],
    en: [slide1En, slide2En, slide3En, slide4En],
};

export default function PassivPraesens() {
    return (
        <FillInExercise
            data={data}
            storageKey={STORAGE_KEY}
            fallbackId="passiv-praesens"
            slidesByLocale={SLIDES_BY_LOCALE}
            sectioned={false}
            inputSizes={{
                full: {
                    minWidth: 180,
                    mobileMinWidth: 90,
                    tabletMinWidth: 140,
                    maxWidth: 1000,
                },
            }}
            buildAnswerKey={(row) => `passiv-praesens-${row.sentenceIndex}`}
            separator=""
            hintMode="first"
            ariaLabel="Passiv Präsens"
        />
    );
}

PassivPraesens.hasHint = true;
PassivPraesens.instructions = data.instructions;
PassivPraesens.title = data.title;
