import { defineExercise } from "../defineExercise";

import HabenOderSein from "../../exercises/A1-1/HabenOderSein";
import WeakVerbConjugation from "../../exercises/A1-1/WeakVerbConjugation";
import StrongVerbsConjugation from "../../exercises/A1-1/StrongVerbsConjugation";
import ModalVerbs from "../../exercises/A1-1/ModalVerbs";
import ArticleDeclension from "../../exercises/A1-1/ArticleDeclension";
import PossessivePronouns from "../../exercises/A1-1/PossessivePronouns";
import KeinOrNicht from "../../exercises/A1-1/KeinOrNicht";
import TranslateSentences from "../../exercises/A1-1/TranslateSentences";

const exercises = {
    "haben-sein": defineExercise(HabenOderSein, "haben-sein-answers"),
    "verb-conjugation": defineExercise(WeakVerbConjugation, "weak-verb-conjugation-answers"),
    "irregular-verbs": defineExercise(StrongVerbsConjugation, "irregular-verbs-answers"),
    "modal-verbs": defineExercise(ModalVerbs, "modal-verbs-answers"),
    articles: defineExercise(ArticleDeclension, "articles-answers"),
    "possessive-pronouns": defineExercise(PossessivePronouns, "possessive-pronouns-answers"),
    "keinOrNicht-sentences": defineExercise(KeinOrNicht, "keinOrNicht-sentences-answers"),
    "translate-sentences": defineExercise(TranslateSentences, "translate-sentences-answers", {
        hasHint: false,
    }),
};

export default exercises;
