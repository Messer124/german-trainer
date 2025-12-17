import ModalVerbExercise from "../exercises/A1-1/ModalVerbExercise";
import StrongVerbsConjugation from "../exercises/A1-1/StrongVerbsConjugation";
import HabenOderSein from "../exercises/A1-1/HabenOderSein";
import TranslateSentences from "../exercises/A1-1/TranslateSentences";
import WeakVerbConjugation from "../exercises/A1-1/WeakVerbConjugation";
import ArticleDeclension from "../exercises/A1-1/ArticleDeclension";
import NounArticles from "../exercises/A1-2/NounArticles";
import PossessivePronouns from "../exercises/A1-1/PossessivePronouns";
import KeinOrNicht from "../exercises/A1-1/KeinOrNicht";
import PluralNounsExercise from "../exercises/A1-2/PluralNouns";
import VerbsPreteritumPerfekt from "../exercises/A1-2/VerbsPreteritumPerfekt";
import HabenSeinPreteritum from "../exercises/A1-2/HabenSeinPreteritum";
import ModalVerbsPreteritum from "../exercises/A1-2/ModalVerbsPreteritum";
import TimeExercise from "../exercises/A1-2/TimeExercise";
import PersonalPronouns from "../exercises/A1-2/PersonalPronouns";
import IndefinitePronouns from "../exercises/A1-2/IndefinitePronouns";
import Imperativ from "../exercises/A1-2/Imperativ";
import Prepositions from "../exercises/A1-2/Prepositions";

export const EXERCISES_BY_LEVEL = {
    "A1.1": {
        "haben-sein": {
            storageKey: "haben-sein-answers",
            component: HabenOderSein,
        },
        "verb-conjugation": {
            storageKey: "weak-verb-conjugation-answers",
            component: WeakVerbConjugation,
        },
        "irregular-verbs": {
            storageKey: "irregular-verbs-answers",
            component: StrongVerbsConjugation,
        },
        "modal-verbs": {
            storageKey: "modal-verbs-answers",
            component: ModalVerbExercise,
        },
        articles: {
            storageKey: "articles-answers",
            component: ArticleDeclension,
        },
        "possessive-pronouns": {
            storageKey: "possessive-pronouns-answers",
            component: PossessivePronouns,
        },
        "keinOrNicht-sentences": {
            storageKey: "keinOrNicht-sentences-answers",
            component: KeinOrNicht,
        },
        "translate-sentences": {
            storageKey: "translate-sentences-answers",
            component: TranslateSentences,
        },
    },
    "A1.2": {
        "noun-articles": {
            storageKey: "noun-articles-answers",
            component: NounArticles,
        },
        time: {
            storageKey: "time-answers",
            component: TimeExercise,
        },
        "plural-nouns": {
            storageKey: "plural-nouns-answers",
            component: PluralNounsExercise,
        },
        "verbs-preteritum-perfekt": {
            storageKey: "verbs-preteritum-perfekt-answers",
            component: VerbsPreteritumPerfekt,
        },
        "haben-sein-preteritum": {
            storageKey: "haben-sein-preteritum-answers",
            component: HabenSeinPreteritum,
        },
        "modal-verbs-preteritum": {
            storageKey: "modal-verbs-preteritum-answers",
            component: ModalVerbsPreteritum,
        },
        "personal-pronouns": {
            storageKey: "personal-pronouns-answers",
            component: PersonalPronouns,
        },
        "indefinite-pronouns": {
            storageKey: "indefinite-pronouns-answers",
            component: IndefinitePronouns,
        },
        "imperativ": {
            storageKey: "imperativ-answers",
            component: Imperativ,
        },
        "prepositions": {
            storageKey: "prepositions-answers",
            component: Prepositions,
        }
    },
};
