import ModalVerbs from "../exercises/A1-1/ModalVerbs";
import StrongVerbsConjugation from "../exercises/A1-1/StrongVerbsConjugation";
import HabenOderSein from "../exercises/A1-1/HabenOderSein";
import TranslateSentences from "../exercises/A1-1/TranslateSentences";
import WeakVerbConjugation from "../exercises/A1-1/WeakVerbConjugation";
import ArticleDeclension from "../exercises/A1-1/ArticleDeclension";
import NounArticles from "../exercises/A1-2/NounArticles";
import PossessivePronouns from "../exercises/A1-1/PossessivePronouns";
import KeinOrNicht from "../exercises/A1-1/KeinOrNicht";
import PluralNounsExercise from "../exercises/A1-2/PluralNouns";
import HabenSeinPreteritum from "../exercises/A1-2/HabenSeinPreteritum";
import ModalVerbsPreteritum from "../exercises/A1-2/ModalVerbsPreteritum";
import TimeExercise from "../exercises/A1-2/TimeExercise";
import PersonalPronouns from "../exercises/A1-2/PersonalPronouns";
import IndefinitePronouns from "../exercises/A1-2/IndefinitePronouns";
import Imperativ from "../exercises/A1-2/Imperativ";
import PrepositionsTime from "../exercises/A1-2/PrepositionsTime";
import PrepositionsPlace from "../exercises/A1-2/PrepositionsPlace";
import Conjunctions from "../exercises/A1-2/Conjunctions";
import SubordinatingConjunctions from "../exercises/A2/SubordinatingConjunctions";
import ConjunctiveAdverbs from "../exercises/A2/ConjunctiveAdverbs";
import AuxiliaryVerbs from "../exercises/A1-2/AuxiliaryVerbs";
import VerbsPerfekt from "../exercises/A1-2/VerbsPerfekt";
import VerbsPreteritum from "../exercises/A1-2/VerbsPreteritum";
import Wechselpraepositionen from "../exercises/A2/Wechselpraepositionen";

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
            component: ModalVerbs,
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
        "auxiliary-verbs": {
            storageKey: "auxiliary-verbs-answers",
            component: AuxiliaryVerbs,
        },
        "verbs-perfekt": {
            storageKey: "verbs-perfekt-answers",
            component: VerbsPerfekt,
        },
        "verbs-preteritum": {
            storageKey: "verbs-preteritum-answers",
            component: VerbsPreteritum,
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
        "prepositions-time": {
            storageKey: "prepositions-time-answers",
            component: PrepositionsTime,
        },
        "prepositions-place": {
            storageKey: "prepositions-place-answers",
            component: PrepositionsPlace,
        },
        conjunctions: {
            storageKey: "conjunctions-answers",
            component: Conjunctions,
        }
    },
    "A2": {
        "subordinating-conjunctions": {
            storageKey: "subordinating-conjunctions-answers",
            component: SubordinatingConjunctions,
        },
        "conjunctive-adverbs": {
            storageKey: "conjunctive-adverbs-answers",
            component: ConjunctiveAdverbs,
        },
        "wechselpraepositionen": {
            storageKey: "wechselpraepositionen-answers",
            component: Wechselpraepositionen,
        }
    },
};
