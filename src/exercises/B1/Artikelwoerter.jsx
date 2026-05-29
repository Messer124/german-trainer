import FillInExercise from "../../components/FillInExercise";

import data from "../../../data/B1/artikelwoerter.json";
import slideRu from "../../../data/B1/images/artikelwoerter.html?raw";
import slideEn from "../../../data/B1/images/en/artikelwoerter.html?raw";

const STORAGE_KEY = "artikelwoerter-answers";
const SLIDES_BY_LOCALE = { ru: [slideRu], en: [slideEn] };

export default function Artikelwoerter() {
    return (
        <FillInExercise
            data={data}
            storageKey={STORAGE_KEY}
            fallbackId="artikelwoerter"
            slidesByLocale={SLIDES_BY_LOCALE}
            sectioned={false}
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
            ariaLabel="Artikelwörter"
        />
    );
}

Artikelwoerter.hasHint = true;
Artikelwoerter.instructions = data.instructions;
Artikelwoerter.title = data.title;
