import FillInExercise from "../../components/FillInExercise";

import data from "../../../data/B1/pronominaladverbien.json";
import slide1Ru from "../../../data/B1/images/pronominaladverbien1.html?raw";
import slide2Ru from "../../../data/B1/images/pronominaladverbien2.html?raw";
import slide3Ru from "../../../data/B1/images/pronominaladverbien3.html?raw";
import slide1En from "../../../data/B1/images/en/pronominaladverbien1.html?raw";
import slide2En from "../../../data/B1/images/en/pronominaladverbien2.html?raw";
import slide3En from "../../../data/B1/images/en/pronominaladverbien3.html?raw";

const STORAGE_KEY = "pronominaladverbien-answers";
const SLIDES_BY_LOCALE = {
    ru: [slide1Ru, slide2Ru, slide3Ru],
    en: [slide1En, slide2En, slide3En],
};

export default function Pronominaladverbien() {
    return (
        <FillInExercise
            data={data}
            storageKey={STORAGE_KEY}
            fallbackId="pronominaladverbien"
            slidesByLocale={SLIDES_BY_LOCALE}
            sectioned={false}
            multiBlank
            inputClassName="input"
            inputSizes={{
                blank: {
                    minWidth: 150,
                    mobileMinWidth: 65,
                    tabletMinWidth: 75,
                    maxWidth: 240,
                },
            }}
            ariaLabel="Pronominaladverbien"
        />
    );
}

Pronominaladverbien.hasHint = true;
Pronominaladverbien.instructions = data.instructions;
Pronominaladverbien.title = data.title;
