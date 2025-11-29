import { useState, useRef, useEffect } from "react";
import { useLocale } from "./contexts/LocaleContext";
import { useLevel } from "./contexts/LevelContext";
import translations from "./locales/locales";

import ModalVerbExercise from "./exercises/A1-1/ModalVerbExercise";
import StrongVerbsConjugation from "./exercises/A1-1/StrongVerbsConjugation";
import HabenOderSein from "./exercises/A1-1/HabenOderSein";
import TranslateSentences from "./exercises/A1-1/TranslateSentences";
import WeakVerbConjugation from "./exercises/A1-1/WeakVerbConjugation";
import ArticleDeclension from "./exercises/A1-1/ArticleDeclension";
import NounArticles from "./exercises/A1-2/NounArticles";
import PossessivePronouns from "./exercises/A1-1/PossessivePronouns";
import KeinOrNicht from "./exercises/A1-1/KeinOrNicht";
import PluralNounsExercise from "./exercises/A1-2/PluralNouns";
import VerbsPreteritumPerfekt from "./exercises/A1-2/VerbsPreteritumPerfekt";
import HabenSeinPreteritum from "./exercises/A1-2/HabenSeinPreteritum";
import ModalVerbsPreteritum from "./exercises/A1-2/ModalVerbsPreteritum";

import Sidebar from "./components/Sidebar";

import "./css/App.css";
import TimeExercise from "./exercises/A1-2/TimeExercise";

// Вкладки по уровням
const TABS_BY_LEVEL = {
  "A1.1": {
    "haben-sein": { component: HabenOderSein },
    "verb-conjugation": { component: WeakVerbConjugation },
    "irregular-verbs": { component: StrongVerbsConjugation },
    "modal-verbs": { component: ModalVerbExercise },
    "articles": { component: ArticleDeclension },
    "possessive-pronouns": { component: PossessivePronouns },
    "keinOrNicht-sentences": { component: KeinOrNicht },
    "translate-sentences": { component: TranslateSentences },
  },
  "A1.2": {
    "noun-articles": { component: NounArticles },
    "time": { component: TimeExercise },
    "plural-nouns": { component: PluralNounsExercise },
    "verbs-preteritum-perfekt": { component: VerbsPreteritumPerfekt },
    "haben-sein-preteritum": { component: HabenSeinPreteritum },
    "modal-verbs-preteritum": { component: ModalVerbsPreteritum },
  },
};

const STORAGE_KEYS = {
  "noun-articles": "noun-articles-answers",
  "haben-sein": "haben-sein-answers",
  "translate-sentences": "translate-sentences",
  "verb-conjugation": "verb-conjugation",
  "articles": "articles",
  "modal-verbs": "modal-answers",
  "possessive-pronouns": "possessive-pronouns-answers",
  "keinOrNicht-sentences": "keinOrNicht-sentences-answers",
  "irregular-verbs": "irregular-answers",
  "time": "time-answers",
  "plural-nouns": "plural-nouns-answers",
  "verbs-preteritum-perfekt": "verbs-preteritum-perfekt-answers",
  "haben-sein-preteritum": "haben-sein-preteritum-answers",
  "modal-verbs-preteritum": "modal-verbs-preteritum-answers",
};

export default function App() {
  const { locale } = useLocale();
  const { level } = useLevel();

  // Инициализация текущей вкладки с учётом уровня
  const [currentTab, setCurrentTab] = useState(() => {
    const tabsForLevel = TABS_BY_LEVEL[level] || TABS_BY_LEVEL["A1.1"];
    const keys = Object.keys(tabsForLevel);
    const savedTab = typeof window !== "undefined"
        ? localStorage.getItem(`last-tab-${level}`)
        : null;

    return savedTab && tabsForLevel[savedTab] ? savedTab : keys[0];
  });

  const tabTitles = translations[locale].tabs;
  const contentRef = useRef(null);
  const [sidebarWidth, setSidebarWidth] = useState("250px");
  const [headerHeight, setHeaderHeight] = useState(0);

  // При смене уровня проверяем, существует ли текущая вкладка в новом уровне
  useEffect(() => {
    const tabsForLevel = TABS_BY_LEVEL[level] || TABS_BY_LEVEL["A1.1"];
    const keys = Object.keys(tabsForLevel);

    setCurrentTab((prev) => {
      if (tabsForLevel[prev]) return prev;

      const savedTab = typeof window !== "undefined"
          ? localStorage.getItem(`last-tab-${level}`)
          : null;

      if (savedTab && tabsForLevel[savedTab]) return savedTab;

      return keys[0];
    });
  }, [level]);

  // Сохраняем последнюю вкладку для конкретного уровня + анимация смены
  useEffect(() => {
    if (typeof window !== "undefined") {
      localStorage.setItem(`last-tab-${level}`, currentTab);
      localStorage.setItem("last-level", level);
    }

    const node = contentRef.current;
    if (!node) return;

    node.classList.remove("fade-in");
    void node.offsetWidth; // принудительный рефлоу
    node.classList.add("fade-in");
  }, [currentTab, level]);

  const tabsForLevel = TABS_BY_LEVEL[level] || TABS_BY_LEVEL["A1.1"];
  if (!tabsForLevel[currentTab]) {
    // берём первую доступную вкладку уровня
    const first = Object.keys(tabsForLevel)[0];
    setCurrentTab(first);
    return null; // временно ничего не рендерим, пока состояние переключается
  }
  const Component = tabsForLevel[currentTab].component;

  const handleClearAnswers = () => {
    const key = STORAGE_KEYS[currentTab];
    if (key) {
      if (typeof window !== "undefined") {
        localStorage.removeItem(key);
        window.dispatchEvent(new CustomEvent(`clear-${key}`));
      }
    }
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