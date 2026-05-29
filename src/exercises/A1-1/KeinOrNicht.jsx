import FillInExercise from "../../components/FillInExercise";

import data from "../../../data/A1-1/kein-nicht.json";
import hintRu from "../../../data/A1-1/images/kein-nicht.html?raw";
import hintEn from "../../../data/A1-1/images/en/kein-nicht.html?raw";

const STORAGE_KEY = "keinOrNicht-sentences-answers";
const SLIDES_BY_LOCALE = { ru: [hintRu], en: [hintEn] };

function KeinOrNichtSentences() {
    return (
        <FillInExercise
            data={data}
            storageKey={STORAGE_KEY}
            fallbackId="keinOrNicht"
            slidesByLocale={SLIDES_BY_LOCALE}
            sectioned={false}
            inputSizes={{
                full: {
                    minWidth: 140,
                    maxWidth: 760,
                },
            }}
            buildAnswerKey={(row) => `keinOrNicht-${row.sentenceIndex}`}
            separator=""
            ariaLabel="Kein oder Nicht"
        />
    );
}

KeinOrNichtSentences.hasHint = true;
KeinOrNichtSentences.instructions = data.instructions;
KeinOrNichtSentences.title = data.title;
export default KeinOrNichtSentences;
