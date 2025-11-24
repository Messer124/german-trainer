import { useState, useEffect } from "react";
import data from "../../../data/A1/noun_articles_with_gender_mismatch.json";
import { useLocale } from "../../contexts/LocaleContext";
import ModalImage from "../../components/ModalImage";
import wordGenderImage from "../../../data/A1/images/wordGender.png";

function NounArticles() {
  const { locale } = useLocale();
  const STORAGE_KEY = "noun-articles-answers";
  const [showImage, setShowImage] = useState(false);

  const [answers, setAnswers] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      return saved ? JSON.parse(saved) : {};
    } catch {
      return {};
    }
  });

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(answers));
  }, [answers]);

  useEffect(() => {
    const handleClear = () => {
      setAnswers({});
    };
  
    window.addEventListener("clear-noun-articles-answers", handleClear);
  
    return () => {
      window.removeEventListener("clear-noun-articles-answers", handleClear);
    };
  }, []);

  useEffect(() => {
    const handleShowHint = () => {
      setShowImage(true);
    };

    document.addEventListener("show-noun-articles-hint", handleShowHint);

    return () => {
      document.removeEventListener("show-noun-articles-hint", handleShowHint);
    };
  }, []);


  const handleChange = (index, value) => {
    const correct = data.items[index].article.toLowerCase();
    setAnswers((prev) => ({
      ...prev,
      [index]: {
        value,
        isCorrect: value.trim().toLowerCase() === correct,
      },
    }));
  };

  return (
    <div>
      {showImage && (
          <ModalImage
              src={wordGenderImage}
              alt={
                locale === "ru"
                    ? "Подсказка: артикли существительных"
                    : "Hint: noun articles"
              }
              onClose={() => setShowImage(false)}
          />
      )}
      <ul style={{ listStyle: "none", padding: 0 }}>
        {data.items.map((item, index) => {
          const value = answers[index]?.value || "";
          const isCorrect = answers[index]?.isCorrect;

          return (
            <li key={index} style={{ marginBottom: 14 }}>
              <input
                type="text"
                value={value}
                onChange={(e) => handleChange(index, e.target.value)}
                style={{
                  width: "4ch",
                  textAlign: "center",
                  marginRight: 12,
                  padding: "6px",
                  borderRadius: "6px",
                  border: "2px solid",
                  outline: "none",
                  transition: "border-color 0.5s ease",
                  borderColor:
                    value === ""
                      ? "#ccc"
                      : isCorrect
                      ? "#6eea8d"
                      : "red",
                }}
              />
              {item.word.replace(/^_+/, '').trim()} — {item.translation[locale]}
            </li>
          );
        })}
      </ul>
    </div>
  );
}

NounArticles.headerButton = (
    <button
        onClick={() =>
            document.dispatchEvent(new CustomEvent("show-noun-articles-hint"))
        }
        className="hint-button"
    >
      !
    </button>
);

NounArticles.instructions = data.instructions;
NounArticles.title = data.title;
export default NounArticles;