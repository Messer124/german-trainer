import FillInExercise from "../../components/FillInExercise";

import data from "../../../data/A1-1/articleDeclension.json";
import hint1Ru from "../../../data/A1-1/images/articleDeclension1.html?raw";
import hint2Ru from "../../../data/A1-1/images/articleDeclension2.html?raw";
import hint3Ru from "../../../data/A1-1/images/articleDeclension3.html?raw";
import hint1En from "../../../data/A1-1/images/en/articleDeclension1.html?raw";
import hint2En from "../../../data/A1-1/images/en/articleDeclension2.html?raw";
import hint3En from "../../../data/A1-1/images/en/articleDeclension3.html?raw";

const STORAGE_KEY = "articles-answers";
const SLIDES_BY_LOCALE = {
    ru: [hint1Ru, hint2Ru, hint3Ru],
    en: [hint1En, hint2En, hint3En],
};

function ArticleDeclension() {
    return (
        <FillInExercise
            data={data}
            storageKey={STORAGE_KEY}
            fallbackId="articles"
            slidesByLocale={SLIDES_BY_LOCALE}
            sectioned={false}
            multiBlank
            inputClassName="input"
            inputSizes={{
                blank: {
                    minWidth: 110,
                    maxWidth: 260,
                },
            }}
            ariaLabel="Article declension"
        />
    );
}

ArticleDeclension.hasHint = true;
ArticleDeclension.instructions = data.instructions;
ArticleDeclension.title = data.title;
export default ArticleDeclension;
