import FillInExercise from "../../components/FillInExercise";

import data from "../../../data/A1-1/posessive_pronouns.json";
import hintRu from "../../../data/A1-1/images/posessive_pronouns.html?raw";
import hintEn from "../../../data/A1-1/images/en/posessive_pronouns.html?raw";

const STORAGE_KEY = "possessive-pronouns-answers";
const SLIDES_BY_LOCALE = { ru: [hintRu], en: [hintEn || hintRu] };

export default function PossessivePronouns() {
    return (
        <FillInExercise
            data={data}
            storageKey={STORAGE_KEY}
            fallbackId="possessive-pronouns"
            slidesByLocale={SLIDES_BY_LOCALE}
            sectioned={false}
            multiBlank
            inputSizes={{
                blank: {
                    minWidth: 110,
                    tabletMinWidth: 95,
                    mobileMinWidth: 80,
                    maxWidth: 420,
                },
            }}
            ariaLabel="Possessive pronouns"
        />
    );
}

PossessivePronouns.hasHint = true;
PossessivePronouns.instructions = data.instructions;
PossessivePronouns.title = data.title;
