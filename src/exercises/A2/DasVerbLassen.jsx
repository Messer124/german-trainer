import FillInExercise from "../../components/FillInExercise";

import data from "../../../data/A2/dasVerbLassen.json";
import slide1Ru from "../../../data/A2/images/dasVerbLassen1.html?raw";
import slide2Ru from "../../../data/A2/images/dasVerbLassen2.html?raw";
import slide3Ru from "../../../data/A2/images/dasVerbLassen3.html?raw";
import slide1En from "../../../data/A2/images/en/dasVerbLassen1.html?raw";
import slide2En from "../../../data/A2/images/en/dasVerbLassen2.html?raw";
import slide3En from "../../../data/A2/images/en/dasVerbLassen3.html?raw";

const STORAGE_KEY = "das-verb-lassen-answers";
const SLIDES_BY_LOCALE = {
    ru: [slide1Ru, slide2Ru, slide3Ru],
    en: [slide1En, slide2En, slide3En],
};

export default function DasVerbLassen() {
    return (
        <FillInExercise
            data={data}
            storageKey={STORAGE_KEY}
            fallbackId="das-verb-lassen"
            slidesByLocale={SLIDES_BY_LOCALE}
            inputSizes={{
                full: {
                    minWidth: 220,
                    tabletMinWidth: 170,
                    mobileMinWidth: 110,
                    maxWidth: 860,
                },
            }}
            buildAnswerKey={(row) => `das-verb-lassen-${row.sentenceIndex}`}
            hintMode="first"
            ariaLabel="Das Verb lassen"
        />
    );
}

DasVerbLassen.hasHint = true;
DasVerbLassen.instructions = data.instructions;
DasVerbLassen.title = data.title;
