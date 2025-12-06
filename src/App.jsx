import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
    Globe2,
    SignalHigh,
    Settings,
    ChevronDown,
    ArrowLeft,
    Menu,
} from "lucide-react";

import { useLocale } from "./contexts/LocaleContext";
import { useLevel } from "./contexts/LevelContext";
import translations from "./locales/locales";
import { EXERCISES_BY_LEVEL } from "./config/exercises";
import { useColoredInputs } from "./hooks/useColoredInputs";


import "./css/App.css";

const DEFAULT_LEVEL = "A1.1";

function getTabsForLevel(level) {
    return EXERCISES_BY_LEVEL[level] || EXERCISES_BY_LEVEL[DEFAULT_LEVEL];
}

export default function App() {
    const { locale, setLocale } = useLocale();
    const { level, setLevel } = useLevel();

    const [currentTab, setCurrentTab] = useState(() => {
        const tabsForLevel = getTabsForLevel(level);
        const keys = Object.keys(tabsForLevel);

        if (typeof window !== "undefined") {
            const savedTab = localStorage.getItem(`last-tab-${level}`);
            if (savedTab && tabsForLevel[savedTab]) {
                return savedTab;
            }
        }

        return keys[0];
    });

    const [isSidebarOpen, setIsSidebarOpen] = useState(true);
    const [settingsOpen, setSettingsOpen] = useState(false);
    const [isMobile, setIsMobile] = useState(false);

    const contentRef = useRef(null);

    const tabsForLevel = getTabsForLevel(level);
    const labels = translations[locale].labels;
    const tabTitles = translations[locale].tabs;

    // переключение вкладок при смене уровня
    useEffect(() => {
        const tabs = getTabsForLevel(level);
        const keys = Object.keys(tabs);

        setCurrentTab((prev) => {
            if (tabs[prev]) return prev;

            if (typeof window !== "undefined") {
                const savedTab = localStorage.getItem(`last-tab-${level}`);
                if (savedTab && tabs[savedTab]) {
                    return savedTab;
                }
            }

            return keys[0];
        });
    }, [level]);

    // сохранение выбора и анимация контента упражнения
    useEffect(() => {
        if (typeof window !== "undefined") {
            localStorage.setItem(`last-tab-${level}`, currentTab);
            localStorage.setItem("last-level", level);
        }

        const node = contentRef.current;
        if (!node) return;

        node.classList.remove("fade-in");
        void node.offsetWidth;
        node.classList.add("fade-in");
    }, [currentTab, level]);

    // адаптив
    useEffect(() => {
        const handleResize = () => {
            const mobile = window.innerWidth < 768;
            setIsMobile(mobile);
            if (mobile) {
                setIsSidebarOpen(true);
            }
        };

        handleResize();
        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize);
    }, []);

    if (!tabsForLevel[currentTab]) {
        const firstKey = Object.keys(tabsForLevel)[0];
        setCurrentTab(firstKey);
        return null;
    }

    const { component: Component, storageKey } = tabsForLevel[currentTab];

    const headerTitle = Component.title?.[locale];
    const instructions = Component.instructions?.[locale];
    const headerButton = Component.headerButton;

    const handleClearAnswers = () => {
        if (!storageKey || typeof window === "undefined") return;

        window.dispatchEvent(new CustomEvent(`clear-${storageKey}`));
    };

    const closeSidebar = () => setIsSidebarOpen(false);
    const openSidebar = () => setIsSidebarOpen(true);

    useColoredInputs(currentTab);

    useEffect(() => {
        if (typeof window === "undefined") return;

        const handleClick = (event) => {
            const target = event.target;
            // важно: Element, а не HTMLElement — чтобы svg тоже проходили
            if (!(target instanceof Element)) return;

            // ищем ближайший .eye-container
            const container = target.closest(".eye-container");
            if (!container) return;

            const popup = container.querySelector(".eye");
            if (!popup) return;

            // показываем подсказку
            popup.classList.add("eye--visible");

            // если уже был таймер — очищаем
            const prevId = popup.getAttribute("data-eye-timeout-id");
            if (prevId) {
                window.clearTimeout(Number(prevId));
            }

            // скрываем через 2 секунды
            const timeoutId = window.setTimeout(() => {
                popup.classList.remove("eye--visible");
                popup.removeAttribute("data-eye-timeout-id");
            }, 1500);

            popup.setAttribute("data-eye-timeout-id", String(timeoutId));
        };

        document.addEventListener("click", handleClick);

        return () => {
            document.removeEventListener("click", handleClick);
        };
    }, []);

    // ---------- SIDEBAR (одна разметка для desktop + mobile) ----------

    const sidebar = (
        <motion.aside
            key="sidebar"
            layout={isMobile}
            className={`sidebar ${
                isMobile ? "sidebar--mobile" : "sidebar--desktop"
            } ${!isMobile && !isSidebarOpen ? "sidebar--collapsed" : ""}`}
            {...(isMobile
                ? {
                    initial: {opacity: 0, x: -20},
                    animate: {opacity: 1, x: 0},
                    exit: {opacity: 0, x: -20},
                    transition: {duration: 0.35, ease: "easeInOut"},
                }
                : {})}
        >
            <div className="sidebar-inner">
                {/* верх: кнопка настроек + закрытие */}
                <div className="sidebar-top">
                    <button
                        type="button"
                        className="sidebar-settings-button"
                        onClick={() => setSettingsOpen((prev) => !prev)}
                    >
                        <Settings size={30} className="sidebar-settings-icon"/>
                        <span className="sidebar-settings-label-text">
          {locale === "ru" ? "Настройки" : "Settings"}
        </span>
                        <ChevronDown
                            size={20}
                            className={`sidebar-settings-chevron ${
                                settingsOpen ? "sidebar-settings-chevron--open" : ""
                            }`}
                        />
                    </button>

                    <button
                        type="button"
                        className="sidebar-close-icon-button"
                        onClick={closeSidebar}
                    >
                        <ArrowLeft size={20}/>
                    </button>
                </div>

                {/* середина: настройки + список упражнений, это область со скроллом */}
                <div className="sidebar-middle">
                    {/* НАСТРОЙКИ — обёртка анимирует height, внутри сама карточка */}
                    <motion.div
                        className="sidebar-settings-dropdown-wrapper"
                        initial={false}
                        animate={settingsOpen ? "open" : "collapsed"}
                        variants={{
                            open: {
                                opacity: 1,
                                height: "auto",
                                marginTop: 10,
                                marginBottom: 14,
                            },
                            collapsed: {
                                opacity: 0,
                                height: 0,
                                marginTop: 0,
                                marginBottom: 0,
                            },
                        }}
                        transition={{duration: 0.25, ease: "easeInOut"}}
                    >
                        <div className="sidebar-settings-dropdown">
                            <label className="sidebar-settings-row">
                                <SignalHigh size={30}/>
                                <span>{labels.level}</span>
                            </label>
                            <select
                                className="sidebar-select"
                                value={level}
                                onChange={(e) => setLevel(e.target.value)}
                            >
                                <option value="A1.1">A1.1</option>
                                <option value="A1.2">A1.2 in progress</option>
                            </select>

                            <label className="sidebar-settings-row sidebar-settings-row--mt">
                                <Globe2 size={30}/>
                                <span>{labels.language}</span>
                            </label>
                            <select
                                className="sidebar-select"
                                value={locale}
                                onChange={(e) => setLocale(e.target.value)}
                            >
                                <option value="ru">Русский</option>
                                <option value="en">English</option>
                            </select>
                        </div>
                    </motion.div>

                    {/* СПИСОК УПРАЖНЕНИЙ */}
                    <div className="sidebar-exercises">
                        <div className="sidebar-exercises-inner">
                            {Object.keys(tabsForLevel).map((key) => {
                                const isActive = currentTab === key;

                                return (
                                    <motion.button
                                        key={key}
                                        type="button"
                                        className="sidebar-tab"
                                        onClick={() => {
                                            setCurrentTab(key);
                                            if (isMobile) closeSidebar();
                                        }}
                                        initial={{opacity: 0, x: -10}}
                                        animate={{opacity: 1, x: 0}}
                                    >
                                        {isActive && (
                                            <motion.div
                                                className="sidebar-tab-active-bg"
                                                layoutId="sidebar-active-bg"
                                                transition={{
                                                    type: "spring",
                                                    stiffness: 400,
                                                    damping: 30,
                                                }}
                                            />
                                        )}
                                        <span className="sidebar-tab-label">{tabTitles[key]}</span>
                                    </motion.button>
                                );
                            })}
                        </div>
                    </div>
                </div>

                {/* кнопка удаления ответов — всегда внизу */}
                <button
                    type="button"
                    className="sidebar-clear-button"
                    onClick={handleClearAnswers}
                >
                    {labels.clearAnswers}
                </button>
            </div>
        </motion.aside>
    );

    // ---------- MAIN (header + exercise-container) ----------

    const main = (
        <div className="main">
            <header className="app-header">
                <div className="app-header-left">
                    {(!isSidebarOpen || isMobile) && (
                        <button
                            type="button"
                            className="header-sidebar-button"
                            onClick={openSidebar}
                        >
                            <Menu size={24}/>
                        </button>
                    )}
                </div>

                <div className="app-header-center">
                    <h1 className="app-header-title">{headerTitle}</h1>
                    <p className="app-header-subtitle">{instructions}</p>
                </div>

                <div className="app-header-right">{headerButton}</div>
            </header>

            <main className="exercise-container">
                <div ref={contentRef} className="exercise-card fade-in">
                    <div className="exercise-scroll" onClick={(e) => e.stopPropagation()}>
                        <Component key={currentTab}/>
                    </div>
                </div>
            </main>
        </div>
    );

    // ---------- MOBILE: полноэкранный сайдбар или контент ----------

    if (isMobile) {
        return (
            <div className="app-layout app-layout--mobile">
                <AnimatePresence mode="wait">
                    {isSidebarOpen ? sidebar : main}
                </AnimatePresence>
            </div>
        );
    }

    // ---------- DESKTOP: сайдбар всегда в DOM, только схлопываем ширину ----------

    return (
        <div className="app-layout">
            {sidebar}
            {main}
        </div>
    );
}
