// contexts/LocaleContext.jsx
import { createContext, useContext, useState, useEffect } from "react";

const LocaleContext = createContext({
  locale: "en",
  // заглушка, чтобы не падало, если использовать вне провайдера
  setLocale: () => {},
});

export function LocaleProvider({ children }) {
  const [locale, setLocale] = useState(() => {
    if (typeof window === "undefined") return "en";

    const saved = localStorage.getItem("app-locale");
    if (saved === "ru" || saved === "en") {
      return saved;
    }

    return "en"; // дефолтный язык
  });

  // сохраняем язык при любом изменении
  useEffect(() => {
    if (typeof window === "undefined") return;
    localStorage.setItem("app-locale", locale);
  }, [locale]);

  const value = { locale, setLocale };

  return (
      <LocaleContext.Provider value={value}>
        {children}
      </LocaleContext.Provider>
  );
}

export function useLocale() {
  return useContext(LocaleContext);
}
