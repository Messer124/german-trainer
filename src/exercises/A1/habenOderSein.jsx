import { useState, useEffect } from "react";
import { useLocale } from "../../contexts/LocaleContext";
import data from "../../../data/A1/haben-sein.json";
import ModalImage from "../../components/ModalImage";
import PageHeader from "../../components/PageHeader";
import habenSeinImage from "../../../data/A1/images/haben-sein.png";
import "../../css/A1/habenOderSein.css";

export default function HabenOderSein() {
  const STORAGE_KEY = "haben-sein-answers";
  const { locale } = useLocale();

  const [answers, setAnswers] = useState(() => {
    const saved = sessionStorage.getItem(STORAGE_KEY);
    try {
      return saved ? JSON.parse(saved) : {};
    } catch {
      return {};
    }
  });

  const [showImage, setShowImage] = useState(false);

  useEffect(() => {
    sessionStorage.setItem(STORAGE_KEY, JSON.stringify(answers));
  }, [answers]);

  useEffect(() => {
    const handleClear = () => setAnswers({});
    window.addEventListener("clear-haben-sein-answers", handleClear);
    return () => window.removeEventListener("clear-haben-sein-answers", handleClear);
  }, []);

  const handleChange = (index, value) => {
    const correct = data.items[index].answer.trim().toLowerCase();
    setAnswers(prev => ({
      ...prev,
      [index]: {
        value,
        isCorrect: value.trim().toLowerCase() === correct
      }
    }));
  };

  return (
      <div className="haben-container">
        <PageHeader
            title={data.title[locale]}
            right={
              <button
                  onClick={() => setShowImage(true)}
                  className="hint-button"
                  title={locale === "ru" ? "Показать подсказку" : "Show hint"}
              >
                !
              </button>
            }
        >
          {data.instructions[locale]}
        </PageHeader>

        {showImage && (
            <ModalImage
                src={habenSeinImage}
                alt="Подсказка: когда использовать haben или sein"
                onClose={() => setShowImage(false)}
            />
        )}

        <ul className="haben-list">
          {data.items.map((item, index) => {
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
                      className={`haben-input ${value === "" ? "" : isCorrect ? "correct" : "incorrect"}`}
                  />
                  {parts[1]}
                </li>
            );
          })}
        </ul>
      </div>
  );
}
