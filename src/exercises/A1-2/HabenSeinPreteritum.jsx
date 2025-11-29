import { useEffect, useState } from "react";
import { useLocale } from "../../contexts/LocaleContext";
import ModalImage from "../../components/ModalImage";
import { usePersistentAnswers } from "../../hooks/usePersistentAnswers";
import data from "../../../data/A1-2/habenSeinPreteritum.json";
import hint from "../../../data/A1-2/images/habenSeinPreteritum.png";
import "../../css/A1-1/habenOderSein.css";

const STORAGE_KEY = "haben-sein-preteritum-answers";

function HabenSeinPreteritum() {
  const { locale } = useLocale();

  const [answers, setAnswers] = usePersistentAnswers(STORAGE_KEY, {});

  const [showImage, setShowImage] = useState(false);

  useEffect(() => {
    const handleShowHint = () => {
      setShowImage(true);
    };

    document.addEventListener(
        "show-haben-sein-preteritum-hint",
        handleShowHint
    );
    return () => {
      document.removeEventListener(
          "show-haben-sein-preteritum-hint",
          handleShowHint
      );
    };
  }, []);

  const handleChange = (index, value) => {
    const correct =
        data.items[0].items[index].answer.trim().toLowerCase();

    setAnswers((prev) => ({
      ...prev,
      [index]: {
        value,
        isCorrect: value.trim().toLowerCase() === correct,
      },
    }));
  };

  return (
      <div className="haben-container">
        {showImage && (
            <ModalImage
                src={hint}
                alt={
                  locale === "ru"
                      ? "Подсказка: haben / sein в Präteritum"
                      : "Hint: haben / sein in Präteritum"
                }
                onClose={() => setShowImage(false)}
            />
        )}

        <ul className="haben-list">
          {data.items[0].items.map((item, index) => {
            const value = answers[index]?.value || "";
            const isCorrect = answers[index]?.isCorrect;

            const parts = item.sentence.split("___");

            return (
                <li key={index} className="haben-item">
                  {parts[0]}
                  <input
                      type="text"
                      value={value}
                      onChange={(e) => handleChange(index, e.target.value)}
                      className={`haben-input ${
                          value === ""
                              ? ""
                              : isCorrect
                                  ? "correct"
                                  : "incorrect"
                      }`}
                  />
                  {parts[1]}
                </li>
            );
          })}
        </ul>
      </div>
  );
}

HabenSeinPreteritum.headerButton = (
    <button
        onClick={() =>
            document.dispatchEvent(
                new CustomEvent("show-haben-sein-preteritum-hint")
            )
        }
        className="hint-button"
    >
      !
    </button>
);

HabenSeinPreteritum.instructions = data.instructions;
HabenSeinPreteritum.title = data.title;

export default HabenSeinPreteritum;

