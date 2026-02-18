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
import Adverbien from "../exercises/A2/Adverbien";
import Relativpronomen from "../exercises/A2/Relativpronomen";
import Ersatzartikel from "../exercises/A2/Ersatzartikel";
import Wortstellung from "../exercises/A2/Wortstellung";
import TeKaMoLo from "../exercises/A2/TeKaMoLo";

export const EXERCISES_BY_LEVEL = {
    "A1.1": {
        "haben-sein": {
            label: "Haben oder Sein",
            storageKey: "haben-sein-answers",
            component: HabenOderSein,
        },
        "verb-conjugation": {
            label: "Schwache Verben",
            storageKey: "weak-verb-conjugation-answers",
            component: WeakVerbConjugation,
        },
        "irregular-verbs": {
            label: "Starke Verben",
            storageKey: "irregular-verbs-answers",
            component: StrongVerbsConjugation,
        },
        "modal-verbs": {
            label: "Modalverben",
            storageKey: "modal-verbs-answers",
            component: ModalVerbs,
        },
        articles: {
            label: "Artikeldeklination",
            storageKey: "articles-answers",
            component: ArticleDeclension,
        },
        "possessive-pronouns": {
            label: "Possessivpronomen",
            storageKey: "possessive-pronouns-answers",
            component: PossessivePronouns,
        },
        "keinOrNicht-sentences": {
            label: "Kein oder Nicht",
            storageKey: "keinOrNicht-sentences-answers",
            component: KeinOrNicht,
        },
        "translate-sentences": {
            label: "Sätze übersetzen",
            storageKey: "translate-sentences-answers",
            component: TranslateSentences,
        },
    },
    "A1.2": {
        "noun-articles": {
            label: "Nomenartikel",
            storageKey: "noun-articles-answers",
            component: NounArticles,
        },
        time: {
            label: "Uhrzeit",
            storageKey: "time-answers",
            component: TimeExercise,
        },
        "plural-nouns": {
            label: "Plural",
            storageKey: "plural-nouns-answers",
            component: PluralNounsExercise,
        },
        "auxiliary-verbs": {
            label: "Hilfsverben im Perfekt",
            storageKey: "auxiliary-verbs-answers",
            component: AuxiliaryVerbs,
        },
        "verbs-perfekt": {
            label: "Verben im Perfekt",
            storageKey: "verbs-perfekt-answers",
            component: VerbsPerfekt,
        },
        "verbs-preteritum": {
            label: "Verben im Präteritum",
            storageKey: "verbs-preteritum-answers",
            component: VerbsPreteritum,
        },
        "haben-sein-preteritum": {
            label: "Haben/Sein im Präteritum",
            storageKey: "haben-sein-preteritum-answers",
            component: HabenSeinPreteritum,
        },
        "modal-verbs-preteritum": {
            label: "Modalverben im Präteritum",
            storageKey: "modal-verbs-preteritum-answers",
            component: ModalVerbsPreteritum,
        },
        "personal-pronouns": {
            label: "Personalpronomen",
            storageKey: "personal-pronouns-answers",
            component: PersonalPronouns,
        },
        "indefinite-pronouns": {
            label: "Indefinitpronomen",
            storageKey: "indefinite-pronouns-answers",
            component: IndefinitePronouns,
        },
        "imperativ": {
            label: "Imperativ",
            storageKey: "imperativ-answers",
            component: Imperativ,
        },
        "prepositions-time": {
            label: "Präpositionen der Zeit",
            storageKey: "prepositions-time-answers",
            component: PrepositionsTime,
        },
        "prepositions-place": {
            label: "Präpositionen des Ortes",
            storageKey: "prepositions-place-answers",
            component: PrepositionsPlace,
        },
        conjunctions: {
            label: "Konjunktionen",
            storageKey: "conjunctions-answers",
            component: Conjunctions,
        }
    },
    "A2": {
        "subordinating-conjunctions": {
            label: "Subordinierende Konjunktionen",
            storageKey: "subordinating-conjunctions-answers",
            component: SubordinatingConjunctions,
        },
        "conjunctive-adverbs": {
            label: "Konjunktional adverbien",
            storageKey: "conjunctive-adverbs-answers",
            component: ConjunctiveAdverbs,
        },
        "wechselpraepositionen": {
            label: "Wechselpräpositionen",
            storageKey: "wechselpraepositionen-answers",
            component: Wechselpraepositionen,
        },
        "adverbien": {
            label: "Direktionaladverb",
            storageKey: "adverbien-answers",
            component: Adverbien,
        },
        "relativpronomen": {
            label: "Relativpronomen",
            storageKey: "relativpronomen-answers",
            component: Relativpronomen,
        },
        "ersatzartikel": {
            label: "Ersatzartikel",
            storageKey: "ersatzartikel-answers",
            component: Ersatzartikel,
        },
        "wortstellung": {
            label: "Wortstellung",
            storageKey: "wortstellung-answers",
            component: Wortstellung,
        },
        "tekamolo": {
            label: "TeKaMoLo",
            storageKey: "tekamolo-answers",
            component: TeKaMoLo,
        }
    },
};
