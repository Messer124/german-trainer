import { useState, useRef, useEffect } from "react";
import { useLocale } from "./contexts/LocaleContext";
import translations from "./locales/locales";
import ModalVerbExercise from "./exercises/A1/ModalVerbExercise";
import StrongVerbsConjugation from "./exercises/A1/StrongVerbsConjugation";
import HabenOderSein from "./exercises/A1/habenOderSein";
import TranslateSentences from "./exercises/A1/TranslateSentences";
import WeakVerbConjugation from "./exercises/A1/WeakVerbConjugation";
import ArticleDeclension from "./exercises/A1/ArticleDeclension";
import NounArticles from "./exercises/A1/NounArticles";
import PossessivePronouns from "./exercises/A1/PossessivePronouns";
import Sidebar from "./components/Sidebar";

import "./css/App.css";

const TABS = {
  "noun-articles": { component: NounArticles },
  "haben-sein": { component: HabenOderSein },
  "verb-conjugation": { component: WeakVerbConjugation },
  "irregular-verbs": { component: StrongVerbsConjugation },
  "modal-verbs": { component: ModalVerbExercise },
  "articles": { component: ArticleDeclension },
  "possessive-pronouns": { component: PossessivePronouns },
  "translate-sentences": { component: TranslateSentences },
};

const STORAGE_KEYS = {
  "noun-articles": "noun-articles-answers",
  "haben-sein": "haben-sein-answers",
  "translate-sentences": "translate-sentences",
  "verb-conjugation": "verb-conjugation",
  "articles": "articles",
  "modal-verbs": "modal-answers",
  "possessive-pronouns": "possessive-pronouns-answers",
  "irregular-verbs": "irregular-answers",
};

export default function App() {
  const [currentTab, setCurrentTab] = useState(() => {
    const savedTab = localStorage.getItem("last-tab");
    return savedTab && TABS[savedTab] ? savedTab : "noun-articles";
  });

  const { locale } = useLocale();
  const tabTitles = translations[locale].tabs;
  const contentRef = useRef(null);
  const [sidebarWidth, setSidebarWidth] = useState("250px");
  const [headerHeight, setHeaderHeight] = useState(0);


    useEffect(() => {
    localStorage.setItem("last-tab", currentTab);

    const node = contentRef.current;
    if (!node) return;

    node.classList.remove("fade-in");
    void node.offsetWidth;
    node.classList.add("fade-in");
  }, [currentTab]);

  const Component = TABS[currentTab].component;

  const handleClearAnswers = () => {
    const key = STORAGE_KEYS[currentTab];
    if (key) {
      localStorage.removeItem(key);
      window.dispatchEvent(new CustomEvent(`clear-${key}`));
    }
  };

  return (
      <div style={{ display: "flex"}}>
        <Sidebar
            currentTab={currentTab}
            setCurrentTab={setCurrentTab}
            tabTitles={tabTitles}
            tabs={TABS}
            locale={locale}
            onClearAnswers={handleClearAnswers}
            onWidthChange={setSidebarWidth}
            headerButton={Component.headerButton}
            instructions={Component.instructions[locale]}
            headerTitle={Component.title[locale]}
            onHeaderHeight={setHeaderHeight}
        >
        </Sidebar>

        <div
            ref={contentRef}
            className="content fade-in"
            style={{
                marginLeft: sidebarWidth,
                marginTop: headerHeight,
                transition: "margin-left 0.3s ease",
                flexGrow: 1}}
        >
          <Component key={currentTab} />
        </div>
      </div>
  );
}
