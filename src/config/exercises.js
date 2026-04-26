import { lazy } from "react";

function exercise({ storageKey, load, title, instructions, hasHint = true }) {
    return {
        storageKey,
        load,
        component: lazy(load),
        title,
        instructions,
        hasHint,
    };
}

export const EXERCISES_BY_LEVEL = {
    "A1.1": {
        "haben-sein": exercise({
            storageKey: "haben-sein-answers",
            load: () => import("../exercises/A1-1/HabenOderSein"),
            title: { ru: "Haben oder Sein", en: "Haben oder Sein" },
            instructions: {
                ru: "Вставьте глагол haben или sein в правильной форме.",
                en: "Insert the verb 'haben' or 'sein' in the correct form.",
            },
        }),
        "verb-conjugation": exercise({
            storageKey: "weak-verb-conjugation-answers",
            load: () => import("../exercises/A1-1/WeakVerbConjugation"),
            title: { ru: "Schwache Verben", en: "Schwache Verben" },
            instructions: {
                ru: "Проспрягайте слабые глаголы по местоимениям",
                en: "Conjugate weak verbs by pronoun groups",
            },
        }),
        "irregular-verbs": exercise({
            storageKey: "irregular-verbs-answers",
            load: () => import("../exercises/A1-1/StrongVerbsConjugation"),
            title: { ru: "Starke Verben", en: "Starke Verben" },
            instructions: {
                ru: "Введите правильную форму сильного глагола.",
                en: "Enter the correct form of the strong verb.",
            },
        }),
        "modal-verbs": exercise({
            storageKey: "modal-verbs-answers",
            load: () => import("../exercises/A1-1/ModalVerbs"),
            title: { ru: "Modalverben", en: "Modalverben" },
            instructions: {
                ru: "Вставьте нужную форму глагола.",
                en: "Insert the correct form of the verb.",
            },
        }),
        articles: exercise({
            storageKey: "articles-answers",
            load: () => import("../exercises/A1-1/ArticleDeclension"),
            title: { ru: "Artikeldeklination", en: "Artikeldeklination" },
            instructions: {
                ru: "Вставьте правильный артикль в пропуск.",
                en: "Insert the correct article into the blank.",
            },
        }),
        "possessive-pronouns": exercise({
            storageKey: "possessive-pronouns-answers",
            load: () => import("../exercises/A1-1/PossessivePronouns"),
            title: { ru: "Possessivpronomen", en: "Possessivpronomen" },
            instructions: {
                ru: "Вставьте правильную форму притяжательного местоимения.",
                en: "Insert the correct form of the possessive pronoun.",
            },
        }),
        "keinOrNicht-sentences": exercise({
            storageKey: "keinOrNicht-sentences-answers",
            load: () => import("../exercises/A1-1/KeinOrNicht"),
            title: { ru: "Kein oder Nicht", en: "Kein oder Nicht" },
            instructions: {
                ru: "Постройте предложения, противоположные по смыслу",
                en: "Construct sentences that are opposite in meaning",
            },
        }),
        "translate-sentences": exercise({
            storageKey: "translate-sentences-answers",
            load: () => import("../exercises/A1-1/TranslateSentences"),
            title: { ru: "Sätze übersetzen", en: "Sätze übersetzen" },
            instructions: {
                ru: "Переведите предложения на немецкий язык",
                en: "Translate the sentences into German",
            },
            hasHint: false,
        }),
    },
    "A1.2": {
        "noun-articles": exercise({
            storageKey: "noun-articles-answers",
            load: () => import("../exercises/A1-2/NounArticles"),
            title: { ru: "Nomenartikel", en: "Nomenartikel" },
            instructions: {
                ru: "Впишите артикль для слов с несовпадением рода в русском языке (der, die, das).",
                en: "Type the correct article (der, die or das).",
            },
        }),
        time: exercise({
            storageKey: "time-answers",
            load: () => import("../exercises/A1-2/TimeExercise"),
            title: { ru: "Uhrzeit", en: "Uhrzeit" },
            instructions: {
                ru: "Введите выражение времени в разговорном стиле.",
                en: "Enter the expression of time in a conversational style.",
            },
        }),
        "plural-nouns": exercise({
            storageKey: "plural-nouns-answers",
            load: () => import("../exercises/A1-2/PluralNouns"),
            title: { ru: "Plural", en: "Plural" },
            instructions: {
                ru: "Введите слово во множественном числе.",
                en: "Enter plural form.",
            },
        }),
        "auxiliary-verbs": exercise({
            storageKey: "auxiliary-verbs-answers",
            load: () => import("../exercises/A1-2/AuxiliaryVerbs"),
            title: { ru: "Hilfsverben im Perfekt", en: "Hilfsverben im Perfekt" },
            instructions: {
                ru: "Определи какой вспомогательный глагол подходит.",
                en: "Determine which auxiliary verb is appropriate.",
            },
        }),
        "verbs-perfekt": exercise({
            storageKey: "verbs-perfekt-answers",
            load: () => import("../exercises/A1-2/VerbsPerfekt"),
            title: { ru: "Verben im Perfekt", en: "Verben im Perfekt" },
            instructions: {
                ru: "Вставьте нужный вспомогательный глагол и глагол в Perfect",
                en: "Insert the required auxiliary verb and verb into the Perfect",
            },
        }),
        "verbs-preteritum": exercise({
            storageKey: "verbs-preteritum-answers",
            load: () => import("../exercises/A1-2/VerbsPreteritum"),
            title: { ru: "Verben im Präteritum", en: "Verben im Präteritum" },
            instructions: {
                ru: "Вставьте форму глагола в Präteritum",
                en: "Insert the correct form of the verb in the Präteritum",
            },
        }),
        "haben-sein-preteritum": exercise({
            storageKey: "haben-sein-preteritum-answers",
            load: () => import("../exercises/A1-2/HabenSeinPreteritum"),
            title: { ru: "Haben/Sein im Präteritum", en: "Haben/Sein im Präteritum" },
            instructions: {
                ru: "Вставьте глагол haben или sein в Präteritum.",
                en: "Insert the verb haben or sein in the Präteritum.",
            },
        }),
        "modal-verbs-preteritum": exercise({
            storageKey: "modal-verbs-preteritum-answers",
            load: () => import("../exercises/A1-2/ModalVerbsPreteritum"),
            title: { ru: "Modalverben im Präteritum", en: "Modalverben im Präteritum" },
            instructions: {
                ru: "Вставьте нужную форму глагола в Präteritum.",
                en: "Insert the correct form of the verb in the Präteritum.",
            },
        }),
        "personal-pronouns": exercise({
            storageKey: "personal-pronouns-answers",
            load: () => import("../exercises/A1-2/Personalpronomen"),
            title: { ru: "Personalpronomen", en: "Personalpronomen" },
            instructions: {
                ru: "Напишите местоимения в нужном падеже",
                en: "Write the pronouns in the required case",
            },
        }),
        "indefinite-pronouns": exercise({
            storageKey: "indefinite-pronouns-answers",
            load: () => import("../exercises/A1-2/IndefinitePronouns"),
            title: { ru: "Indefinitpronomen", en: "Indefinitpronomen" },
            instructions: {
                ru: "Подберите неопределенное местоимение в нужном падеже.",
                en: "Choose an indefinite pronoun in the correct case.",
            },
        }),
        imperativ: exercise({
            storageKey: "imperativ-answers",
            load: () => import("../exercises/A1-2/Imperativ"),
            title: { ru: "Imperativ", en: "Imperativ" },
            instructions: {
                ru: "Поставьте глагол в Imperativ в нужной форме.",
                en: "Put the verb in the Imperative in the correct form.",
            },
        }),
        "prepositions-time": exercise({
            storageKey: "prepositions-time-answers",
            load: () => import("../exercises/A1-2/PrepositionsTime"),
            title: { ru: "Präpositionen der Zeit", en: "Präpositionen der Zeit" },
            instructions: {
                ru: "Подберите правильный предлог.",
                en: "Choose the correct preposition.",
            },
        }),
        "prepositions-place": exercise({
            storageKey: "prepositions-place-answers",
            load: () => import("../exercises/A1-2/PrepositionsPlace"),
            title: { ru: "Präpositionen des Ortes", en: "Präpositionen des Ortes" },
            instructions: {
                ru: "Подберите правильный предлог и артикль",
                en: "Choose the correct preposition and article",
            },
        }),
        conjunctions: exercise({
            storageKey: "conjunctions-answers",
            load: () => import("../exercises/A1-2/Conjunctions"),
            title: { ru: "Konjunktionen", en: "Konjunktionen" },
            instructions: {
                ru: "Подберите нужный сочинительный союз, союзное слово или подчинительный союз.",
                en: "Choose the appropriate coordinating conjunction, conjunctive adverb, or subordinating conjunction.",
            },
        }),
    },
    A2: {
        wechselpraepositionen: exercise({
            storageKey: "wechselpraepositionen-answers",
            load: () => import("../exercises/A2/Wechselpraepositionen"),
            title: { ru: "Wechsel präpositionen", en: "Wechsel präpositionen" },
            instructions: { ru: "Выполните задания", en: "Complete the tasks" },
        }),
        adverbien: exercise({
            storageKey: "adverbien-answers",
            load: () => import("../exercises/A2/Direktionaladverb"),
            title: { ru: "Direktionaladverb", en: "Direktionaladverb" },
            instructions: {
                ru: "Переведите предложения, используя наречия места и направления",
                en: "Translate the sentences using adverbs of place and direction",
            },
        }),
        relativpronomen: exercise({
            storageKey: "relativpronomen-answers",
            load: () => import("../exercises/A2/Relativpronomen"),
            title: { ru: "Relativpronomen", en: "Relativpronomen" },
            instructions: {
                ru: "Определите, какое относительное местоимение необходимо",
                en: "Determine which relative pronoun is needed",
            },
        }),
        ersatzartikel: exercise({
            storageKey: "ersatzartikel-answers",
            load: () => import("../exercises/A2/Ersatzartikel"),
            title: { ru: "Ersatzartikel", en: "Ersatzartikel" },
            instructions: { ru: "Вставьте Ersatzartikel", en: "Enter Ersatzartikel" },
        }),
        wortstellung: exercise({
            storageKey: "wortstellung-answers",
            load: () => import("../exercises/A2/Wortstellung"),
            title: { ru: "Wortstellung", en: "Word order" },
            instructions: {
                ru: "Переведите предложения на немецкий язык",
                en: "Translate the sentences into German",
            },
        }),
        tekamolo: exercise({
            storageKey: "tekamolo-answers",
            load: () => import("../exercises/A2/TeKaMoLo"),
            title: { ru: "TeKaMoLo", en: "TeKaMoLo" },
            instructions: {
                ru: "Составьте предложения в правильном порядке",
                en: "Put the sentences in the correct order",
            },
        }),
        verbrektion: exercise({
            storageKey: "verbrektion-answers",
            load: () => import("../exercises/A2/Verbrektion"),
            title: { ru: "Verbrektion", en: "Verbrektion" },
            instructions: {
                ru: "Вставьте подходящий для глагола предлог",
                en: "Insert a suitable preposition for the verb",
            },
        }),
        konjunktiv2: exercise({
            storageKey: "konjunktiv2-answers",
            load: () => import("../exercises/A2/Konjunktiv2"),
            title: { ru: "Konjunktiv II", en: "Konjunktiv II" },
            instructions: {
                ru: "Переведите предложения на немецкий язык",
                en: "Translate the sentences into German",
            },
        }),
        adjektivdeklination: exercise({
            storageKey: "adjektivdeklination-answers",
            load: () => import("../exercises/A2/Adjektivdeklination"),
            title: { ru: "Adjektivdeklination", en: "Adjektivdeklination" },
            instructions: {
                ru: "Добавьте правильные окончания к прилагательным",
                en: "Add the correct endings to the adjectives",
            },
        }),
        "steigerung-der-adjektive": exercise({
            storageKey: "steigerung-der-adjektive-answers",
            load: () => import("../exercises/A2/SteigerungDerAdjektive"),
            title: { ru: "Steigerung der Adjektive", en: "Steigerung der Adjektive" },
            instructions: {
                ru: "Напишите формы Komparativ, Superlativ от прилагательных",
                en: "Write the comparative and superlative forms of the adjectives",
            },
        }),
        "passiv-praesens": exercise({
            storageKey: "passiv-praesens-answers",
            load: () => import("../exercises/A2/PassivPraesens"),
            title: { ru: "Passiv Präsens", en: "Passiv Präsens" },
            instructions: { ru: "Переведите предложения", en: "Translate the sentences" },
        }),
        "n-deklination": exercise({
            storageKey: "n-deklination-answers",
            load: () => import("../exercises/A2/NDeklination"),
            title: { ru: "N-Deklination", en: "N-Deklination" },
            instructions: {
                ru: "Допишите окончания у существительных там, где нужно",
                en: "Add endings to nouns where necessary",
            },
        }),
        "welch-was-fuer-ein": exercise({
            storageKey: "welch-was-fuer-ein-answers",
            load: () => import("../exercises/A2/WelchWasFuerEin"),
            title: { ru: "Welch / Was für ein", en: "Welch / Was für ein" },
            instructions: {
                ru: "Подберите нужный вопрос was für ein/e или welche",
                en: "Select the correct question: was für ein/e or welche",
            },
        }),
        plusquamperfekt: exercise({
            storageKey: "plusquamperfekt-answers",
            load: () => import("../exercises/A2/Plusquamperfekt"),
            title: { ru: "Plusquamperfekt", en: "Plusquamperfekt" },
            instructions: {
                ru: "Образуйте сложные предложения с Plusquamperfekt",
                en: "Form complex sentences with Plusquamperfekt",
            },
        }),
        "das-verb-lassen": exercise({
            storageKey: "das-verb-lassen-answers",
            load: () => import("../exercises/A2/DasVerbLassen"),
            title: { ru: "Das Verb lassen", en: "Das Verb lassen" },
            instructions: {
                ru: "Выполните задания с глаголом lassen",
                en: "Complete the tasks with the verb lassen",
            },
        }),
        infinitivsaetze: exercise({
            storageKey: "infinitivsaetze-answers",
            load: () => import("../exercises/A2/Infinitivsaetze"),
            title: { ru: "Infinitivsätze", en: "Infinitivsätze" },
            instructions: { ru: "Выполните задания", en: "Complete the tasks" },
        }),
        indefinitpronomen: exercise({
            storageKey: "indefinitpronomen-answers",
            load: () => import("../exercises/A2/Indefinitpronomen"),
            title: { ru: "Indefinitpronomen", en: "Indefinitpronomen" },
            instructions: { ru: "Выполните задания", en: "Complete the tasks" },
        }),
    },
    B1: {},
};
