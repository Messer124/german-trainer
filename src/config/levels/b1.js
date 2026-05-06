import { defineExercise } from "../defineExercise";

import SteigerungVonAdjektiven from "../../exercises/B1/SteigerungVonAdjektiven";
import Partizipien from "../../exercises/B1/Partizipien";
import Pronominaladverbien from "../../exercises/B1/Pronominaladverbien";

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
};

export default exercises;
