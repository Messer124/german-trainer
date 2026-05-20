import { defineExercise } from "../defineExercise";

import SteigerungVonAdjektiven from "../../exercises/B1/SteigerungVonAdjektiven";
import Partizipien from "../../exercises/B1/Partizipien";
import Pronominaladverbien from "../../exercises/B1/Pronominaladverbien";
import Konjunktiv2 from "../../exercises/B1/Konjunktiv2";
import PassivVergangenheit from "../../exercises/B1/PassivVergangenheit";

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
};

export default exercises;
