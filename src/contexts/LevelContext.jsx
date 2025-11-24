import { createContext, useContext, useState, useEffect } from "react";

const LevelContext = createContext();

export const LevelProvider = ({ children }) => {
  const [level, setLevel] = useState(() => {
    if (typeof window !== "undefined") {
      return localStorage.getItem("level") || "A1.1";
    }
    return "A1.1";
  });

  useEffect(() => {
    if (typeof window !== "undefined") {
      localStorage.setItem("level", level);
    }
  }, [level]);

  return (
      <LevelContext.Provider value={{ level, setLevel }}>
        {children}
      </LevelContext.Provider>
  );
};

export const useLevel = () => useContext(LevelContext);

