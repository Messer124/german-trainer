import FillInExercise from "../../components/FillInExercise";

import data from "../../../data/A2/plusquamperfekt.json";
import slideRu from "../../../data/A2/images/plusquamperfekt.html?raw";
import slideEn from "../../../data/A2/images/en/plusquamperfekt.html?raw";

const STORAGE_KEY = "plusquamperfekt-answers";
const SLIDES_BY_LOCALE = { ru: [slideRu], en: [slideEn] };

export default function Plusquamperfekt() {
    return (
        <FillInExercise
            data={data}
            storageKey={STORAGE_KEY}
            fallbackId="plusquamperfekt"
            slidesByLocale={SLIDES_BY_LOCALE}
            inputSizes={{
                full: {
                    minWidth: 220,
                    tabletMinWidth: 170,
                    mobileMinWidth: 110,
                    maxWidth: 860,
                },
            }}
            buildAnswerKey={(row) => `plusquamperfekt-${row.sentenceIndex}`}
            hintMode="first"
            ariaLabel="Plusquamperfekt"
        />
    );
}

Plusquamperfekt.hasHint = true;
Plusquamperfekt.instructions = data.instructions;
Plusquamperfekt.title = data.title;
