import { useState, useEffect } from "react";
import data from "../../../data/A1/past-tense.json";

export default function PastTense() {
  const STORAGE_KEY = "past-tense-answers";

  const [answers, setAnswers] = useState(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    try {
      return saved ? JSON.parse(saved) : {};
    } catch {
      return {};
    }
  });

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(answers));
  }, [answers]);

  useEffect(() => {
    const handleClear = () => setAnswers({});
    window.addEventListener("clear-past-tense", handleClear);
    return () => window.removeEventListener("clear-past-tense", handleClear);
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
    <div>
      <div style={{
        borderBottom: "3px solid #4ea1f3", 
        marginBottom: "24px",
        paddingBottom: "10px",
      }}>
        <h2 style={{
          margin: 0,
          fontSize: "24px",
          fontWeight: "600",
          color: "#222",
        }}>
          {data.title}
        </h2>
      </div>
      <p style={{ marginBottom: 20 }}>{data.instructions}</p>
      <ul style={{ listStyle: "none", padding: 0 }}>
        {data.items.map((item, index) => {
          const value = answers[index]?.value || "";
          const isCorrect = answers[index]?.isCorrect;
          const parts = item.sentence.split("___");

          return (
            <li key={index} style={{ marginBottom: 12 }}>
              {parts[0]}
              <input
                type="text"
                value={value}
                onChange={(e) => handleChange(index, e.target.value)}
                style={{
                  transition: "border-color 0.5s ease",
                  margin: "0 8px",
                  padding: "6px",
                  borderRadius: "6px",
                  border: "2px solid",
                  outline: "none",
                  borderColor:
                    value === ""
                      ? "#ccc"
                      : isCorrect
                      ? "#6eea8d"
                      : "red"
                }}
              />
              {parts[1]}
            </li>
          );
        })}
      </ul>
    </div>
  );
}
