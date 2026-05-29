import FillInExercise from "../../components/FillInExercise";

import data from "../../../data/A1-2/modalVerbsPreteritum.json";
import hintRu from "../../../data/A1-2/images/modalVersPreteritum.html?raw";
import hintEn from "../../../data/A1-2/images/en/modalVersPreteritum.html?raw";

const STORAGE_KEY = "modal-verbs-preteritum-answers";
const SLIDES_BY_LOCALE = { ru: [hintRu], en: [hintEn] };

function ModalVerbsPreteritum() {
    return (
        <FillInExercise
            data={data}
            storageKey={STORAGE_KEY}
            fallbackId="modal-verbs-preteritum"
            slidesByLocale={SLIDES_BY_LOCALE}
            sectioned={false}
            placeholderField="verb"
            inputClassName="input"
            inputSizes={{
                blank: {
                    minWidth: 120,
                    maxWidth: 260,
                },
            }}
            buildAnswerKey={(row) => `${row.sentenceIndex}`}
            hintMode="first"
            ariaLabel="Modal verb preteritum"
        />
    );
}

ModalVerbsPreteritum.hasHint = true;
ModalVerbsPreteritum.instructions = data.instructions;
ModalVerbsPreteritum.title = data.title;
export default ModalVerbsPreteritum;
