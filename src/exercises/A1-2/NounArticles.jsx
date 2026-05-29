import FillInExercise from "../../components/FillInExercise";

import data from "../../../data/A1-2/noun_articles.json";
import hint1Ru from "../../../data/A1-2/images/wordGender1.html?raw";
import hint2Ru from "../../../data/A1-2/images/wordGender2.html?raw";
import hint1En from "../../../data/A1-2/images/en/wordGender1.html?raw";

const STORAGE_KEY = "noun-articles-answers";
const SLIDES_BY_LOCALE = {
    ru: [hint1Ru, hint2Ru],
    en: [hint1En, hint2Ru],
};

function NounArticles() {
    return (
        <FillInExercise
            data={data}
            storageKey={STORAGE_KEY}
            fallbackId="noun-articles"
            slidesByLocale={SLIDES_BY_LOCALE}
            sectioned={false}
            sentenceField="word"
            answerField="article"
            inputClassName="input"
            inputSizes={{
                full: {
                    minWidth: 100,
                    maxWidth: 220,
                },
            }}
            buildAnswerKey={(row) => `${row.sentenceIndex}`}
            separator=" —"
            hintMode="first"
            ariaLabel="Noun article"
        />
    );
}

NounArticles.hasHint = true;
NounArticles.instructions = data.instructions;
NounArticles.title = data.title;
export default NounArticles;
