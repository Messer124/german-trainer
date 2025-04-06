import { createContext, useContext, useState } from "react";

const LevelContext = createContext();

export const LevelProvider = ({ children }) => {
  const [level, setLevel] = useState("A1");
  return (
    <LevelContext.Provider value={{ level, setLevel }}>
      {children}
    </LevelContext.Provider>
  );
};

export const useLevel = () => useContext(LevelContext);
