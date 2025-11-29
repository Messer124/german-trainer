import { useState, useRef, useEffect } from "react";
import { useLocale } from "./contexts/LocaleContext";
import { useLevel } from "./contexts/LevelContext";
import translations from "./locales/locales";

import Sidebar from "./components/Sidebar";
import { EXERCISES_BY_LEVEL } from "./config/exercises";

import "./css/App.css";

const DEFAULT_LEVEL = "A1.1";

function getTabsForLevel(level) {
  return EXERCISES_BY_LEVEL[level] || EXERCISES_BY_LEVEL[DEFAULT_LEVEL];
}

export default function App() {
  const { locale } = useLocale();
  const { level } = useLevel();

  const [currentTab, setCurrentTab] = useState(() => {
    const tabsForLevel = getTabsForLevel(level);
    const keys = Object.keys(tabsForLevel);

    const savedTab =
        typeof window !== "undefined"
            ? localStorage.getItem(`last-tab-${level}`)
            : null;

    return savedTab && tabsForLevel[savedTab] ? savedTab : keys[0];
  });

  const tabTitles = translations[locale].tabs;
  const contentRef = useRef(null);
  const [sidebarWidth, setSidebarWidth] = useState(0);
  const [headerHeight, setHeaderHeight] = useState(0);

  // Переключение вкладок при смене уровня
  useEffect(() => {
    const tabsForLevel = getTabsForLevel(level);
    const keys = Object.keys(tabsForLevel);

    setCurrentTab((prev) => {
      if (tabsForLevel[prev]) return prev;

      const savedTab =
          typeof window !== "undefined"
              ? localStorage.getItem(`last-tab-${level}`)
              : null;

      if (savedTab && tabsForLevel[savedTab]) return savedTab;

      return keys[0];
    });
  }, [level]);

  // Сохранение последней вкладки и уровня + анимация смены контента
  useEffect(() => {
    if (typeof window !== "undefined") {
      localStorage.setItem(`last-tab-${level}`, currentTab);
      localStorage.setItem("last-level", level);
    }

    const node = contentRef.current;
    if (!node) return;

    node.classList.remove("fade-in");
    void node.offsetWidth; // форсируем рефлоу
    node.classList.add("fade-in");
  }, [currentTab, level]);

  const tabsForLevel = getTabsForLevel(level);

  if (!tabsForLevel[currentTab]) {
    const first = Object.keys(tabsForLevel)[0];
    setCurrentTab(first);
    return null;
  }

  const { component: Component, storageKey } = tabsForLevel[currentTab];

  const handleClearAnswers = () => {
    if (!storageKey || typeof window === "undefined") {
      return;
    }

    // Локальная очистка теперь полностью внутри хука
    window.dispatchEvent(new CustomEvent(`clear-${storageKey}`));
  };

  return (
      <div className="app-container">
        <Sidebar
            currentTab={currentTab}
            setCurrentTab={setCurrentTab}
            tabTitles={tabTitles}
            tabs={tabsForLevel}
            locale={locale}
            onClearAnswers={handleClearAnswers}
            onWidthChange={setSidebarWidth}
            headerButton={Component.headerButton}
            instructions={Component.instructions?.[locale]}
            headerTitle={Component.title?.[locale]}
            onHeaderHeight={setHeaderHeight}
        />

        <div
            ref={contentRef}
            className="content fade-in"
            style={{
              marginLeft: sidebarWidth,
              marginTop: headerHeight,
              transition: "margin-left 0.3s ease",
              flexGrow: 1,
            }}
        >
          <Component key={currentTab} />
        </div>
      </div>
  );
}
