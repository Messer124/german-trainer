import { defineExercise } from "../defineExercise";

import Wechselpraepositionen from "../../exercises/A2/Wechselpraepositionen";
import Direktionaladverb from "../../exercises/A2/Direktionaladverb";
import Relativpronomen from "../../exercises/A2/Relativpronomen";
import Ersatzartikel from "../../exercises/A2/Ersatzartikel";
import Wortstellung from "../../exercises/A2/Wortstellung";
import TeKaMoLo from "../../exercises/A2/TeKaMoLo";
import Verbrektion from "../../exercises/A2/Verbrektion";
import Konjunktiv2 from "../../exercises/A2/Konjunktiv2";
import Adjektivdeklination from "../../exercises/A2/Adjektivdeklination";
import SteigerungDerAdjektive from "../../exercises/A2/SteigerungDerAdjektive";
import PassivPraesens from "../../exercises/A2/PassivPraesens";
import NDeklination from "../../exercises/A2/NDeklination";
import WelchWasFuerEin from "../../exercises/A2/WelchWasFuerEin";
import Plusquamperfekt from "../../exercises/A2/Plusquamperfekt";
import DasVerbLassen from "../../exercises/A2/DasVerbLassen";
import Infinitivsaetze from "../../exercises/A2/Infinitivsaetze";
import Indefinitpronomen from "../../exercises/A2/Indefinitpronomen";

const exercises = {
    wechselpraepositionen: defineExercise(Wechselpraepositionen, "wechselpraepositionen-answers"),
    adverbien: defineExercise(Direktionaladverb, "adverbien-answers"),
    relativpronomen: defineExercise(Relativpronomen, "relativpronomen-answers"),
    ersatzartikel: defineExercise(Ersatzartikel, "ersatzartikel-answers"),
    wortstellung: defineExercise(Wortstellung, "wortstellung-answers"),
    tekamolo: defineExercise(TeKaMoLo, "tekamolo-answers"),
    verbrektion: defineExercise(Verbrektion, "verbrektion-answers"),
    konjunktiv2: defineExercise(Konjunktiv2, "konjunktiv2-answers"),
    adjektivdeklination: defineExercise(Adjektivdeklination, "adjektivdeklination-answers"),
    "steigerung-der-adjektive": defineExercise(SteigerungDerAdjektive, "steigerung-der-adjektive-answers"),
    "passiv-praesens": defineExercise(PassivPraesens, "passiv-praesens-answers"),
    "n-deklination": defineExercise(NDeklination, "n-deklination-answers"),
    "welch-was-fuer-ein": defineExercise(WelchWasFuerEin, "welch-was-fuer-ein-answers"),
    plusquamperfekt: defineExercise(Plusquamperfekt, "plusquamperfekt-answers"),
    "das-verb-lassen": defineExercise(DasVerbLassen, "das-verb-lassen-answers"),
    infinitivsaetze: defineExercise(Infinitivsaetze, "infinitivsaetze-answers"),
    indefinitpronomen: defineExercise(Indefinitpronomen, "indefinitpronomen-answers"),
};

export default exercises;
