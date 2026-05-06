import { defineExercise } from "../defineExercise";

import NounArticles from "../../exercises/A1-2/NounArticles";
import TimeExercise from "../../exercises/A1-2/TimeExercise";
import PluralNouns from "../../exercises/A1-2/PluralNouns";
import AuxiliaryVerbs from "../../exercises/A1-2/AuxiliaryVerbs";
import VerbsPerfekt from "../../exercises/A1-2/VerbsPerfekt";
import VerbsPreteritum from "../../exercises/A1-2/VerbsPreteritum";
import HabenSeinPreteritum from "../../exercises/A1-2/HabenSeinPreteritum";
import ModalVerbsPreteritum from "../../exercises/A1-2/ModalVerbsPreteritum";
import Personalpronomen from "../../exercises/A1-2/Personalpronomen";
import IndefinitePronouns from "../../exercises/A1-2/IndefinitePronouns";
import Imperativ from "../../exercises/A1-2/Imperativ";
import PrepositionsTime from "../../exercises/A1-2/PrepositionsTime";
import PrepositionsPlace from "../../exercises/A1-2/PrepositionsPlace";
import Conjunctions from "../../exercises/A1-2/Conjunctions";

const exercises = {
    "noun-articles": defineExercise(NounArticles, "noun-articles-answers"),
    time: defineExercise(TimeExercise, "time-answers"),
    "plural-nouns": defineExercise(PluralNouns, "plural-nouns-answers"),
    "auxiliary-verbs": defineExercise(AuxiliaryVerbs, "auxiliary-verbs-answers"),
    "verbs-perfekt": defineExercise(VerbsPerfekt, "verbs-perfekt-answers"),
    "verbs-preteritum": defineExercise(VerbsPreteritum, "verbs-preteritum-answers"),
    "haben-sein-preteritum": defineExercise(HabenSeinPreteritum, "haben-sein-preteritum-answers"),
    "modal-verbs-preteritum": defineExercise(ModalVerbsPreteritum, "modal-verbs-preteritum-answers"),
    "personal-pronouns": defineExercise(Personalpronomen, "personal-pronouns-answers"),
    "indefinite-pronouns": defineExercise(IndefinitePronouns, "indefinite-pronouns-answers"),
    imperativ: defineExercise(Imperativ, "imperativ-answers"),
    "prepositions-time": defineExercise(PrepositionsTime, "prepositions-time-answers"),
    "prepositions-place": defineExercise(PrepositionsPlace, "prepositions-place-answers"),
    conjunctions: defineExercise(Conjunctions, "conjunctions-answers"),
};

export default exercises;
