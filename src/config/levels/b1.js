import { defineExercise } from "../defineExercise";

import SteigerungVonAdjektiven from "../../exercises/B1/SteigerungVonAdjektiven";
import Partizipien from "../../exercises/B1/Partizipien";
import Pronominaladverbien from "../../exercises/B1/Pronominaladverbien";
import Konjunktiv2 from "../../exercises/B1/Konjunktiv2";
import PassivVergangenheit from "../../exercises/B1/PassivVergangenheit";
import DasVerbBrauchen from "../../exercises/B1/DasVerbBrauchen";
import SubstantivierteAdjektive from "../../exercises/B1/SubstantivierteAdjektive";
import Doppelkonjunktionen from "../../exercises/B1/Doppelkonjunktionen";
import Artikelwoerter from "../../exercises/B1/Artikelwoerter";
import PraepositionenMitGenitiv from "../../exercises/B1/PraepositionenMitGenitiv";
import Konjunktionen from "../../exercises/B1/Konjunktionen";

const exercises = {
    "steigerung-von-adjektiven": defineExercise(
        SteigerungVonAdjektiven,
        "steigerung-von-adjektiven-answers"
    ),
    partizipien: defineExercise(
        Partizipien,
        "partizipien-answers"
    ),
    pronominaladverbien: defineExercise(
        Pronominaladverbien,
        "pronominaladverbien-answers"
    ),
    konjunktiv2: defineExercise(
        Konjunktiv2,
        "b1-konjunktiv2-answers"
    ),
    passivVergangenheit: defineExercise(
        PassivVergangenheit,
        "b1-passiv-vergangenheit-answers"
    ),
    dasVerbBrauchen: defineExercise(
        DasVerbBrauchen,
        "das-verb-brauchen-answers"
    ),
    substantivierteAdjektive: defineExercise(
        SubstantivierteAdjektive,
        "substantivierte-adjektive-answers"
    ),
    doppelkonjunktionen: defineExercise(
        Doppelkonjunktionen,
        "doppelkonjunktionen-answers"
    ),
    artikelwoerter: defineExercise(
        Artikelwoerter,
        "artikelwoerter-answers"
    ),
    praepositionenMitGenitiv: defineExercise(
        PraepositionenMitGenitiv,
        "praepositionen-mit-genitiv-answers"
    ),
    konjunktionen: defineExercise(
        Konjunktionen,
        "konjunktionen-answers"
    ),
};

export default exercises;
