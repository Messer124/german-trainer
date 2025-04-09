import { useState, useEffect, useRef } from "react";
import { useLocale } from "./contexts/LocaleContext";
import ModalVerbExercise from "./exercises/A1/ModalVerbExercise";
import StrongVerbsConjugation from "./exercises/A1/StrongVerbsConjugation";
import HabenOderSein from "./exercises/A1/habenOderSein";
import TranslateSentences from "./exercises/A1/TranslateSentences";
import WeakVerbConjugation from "./exercises/A1/WeakVerbConjugation";
import PastTense from "./exercises/A1/PastTense";
import ArticleDeclension from "./exercises/A1/ArticleDeclension";
import NounArticles from "./exercises/A1/NounArticles";
import PossessivePronouns from "./exercises/A1/PossessivePronouns";
import SidebarControls from "./components/SidebarControls";
import translations from "./locales/locales";
import "./css/App.css";

const TABS = {
  "noun-articles": { component: NounArticles },
  "haben-sein": { component: HabenOderSein },
  // "past-tense": { component: PastTense },
  "verb-conjugation": { component: WeakVerbConjugation },
  "irregular-verbs": { component: StrongVerbsConjugation },
  "modal-verbs": { component: ModalVerbExercise },
  "articles": { component: ArticleDeclension },
  "possessive-pronouns": { component: PossessivePronouns },
  "translate-sentences": { component: TranslateSentences }
};

const STORAGE_KEYS = {
  "noun-articles": "noun-articles-answers",
  "haben-sein": "haben-sein-answers",
  "translate-sentences": "translate-sentences",
  "verb-conjugation": "verb-conjugation",
  //"past-tense": "past-tense",
  "articles": "articles",
  "modal-verbs": "modal-answers",
  "possessive-pronouns": "possessive-pronouns-answers",
  "irregular-verbs": "irregular-answers"
};

export default function App() {
  const [currentTab, setCurrentTab] = useState(() => {
    const savedTab = localStorage.getItem("last-tab");
    return savedTab && TABS[savedTab] ? savedTab : "noun-articles";
  });

  const { locale } = useLocale();
  const tabTitles = translations[locale].tabs;
  const contentRef = useRef(null);

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
      <div className="app-container">
        <div className="sidebar">
          <SidebarControls />

          <div>
            {Object.keys(TABS).map((key) => (
                <div
                    key={key}
                    className={`tab-item ${currentTab === key ? "active" : ""}`}
                    onClick={() => setCurrentTab(key)}
                >
                  {tabTitles[key]}
                </div>
            ))}
          </div>

          <button className="clear-button" onClick={handleClearAnswers}>
            {translations[locale].labels.clearAnswers}
          </button>
        </div>

        <div ref={contentRef} className="content fade-in">
          <Component key={currentTab}/>
        </div>
      </div>
  );
}
