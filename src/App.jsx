import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
    Globe2,
    SignalHigh,
    Settings,
    Palette,
    ArrowLeft,
    Menu,
} from "lucide-react";
import { useLocale } from "./contexts/LocaleContext";
import { useLevel } from "./contexts/LevelContext";
import translations from "./locales/locales";
import { EXERCISES_BY_LEVEL } from "./config/exercises";
import { useColoredInputs } from "./hooks/useColoredInputs";
import { clearAnswersByStorageKey } from "./hooks/usePersistentAnswers";
import "./css/App.css";

const DEFAULT_LEVEL = "A1.1";
const MOBILE_BREAKPOINT = 600;
const THEME_STORAGE_KEY = "app-theme";

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
    const [theme, setTheme] = useState(() => {
        if (typeof window === "undefined") {
            return "light";
        }

        const savedTheme = localStorage.getItem(THEME_STORAGE_KEY);
        return savedTheme === "dark" ? "dark" : "light";
    });

    const contentRef = useRef(null);
    const hasThemeMountedRef = useRef(false);
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

    useEffect(() => {
        if (typeof document === "undefined") return;

        const root = document.documentElement;
        root.setAttribute("data-theme", theme);

        if (typeof window !== "undefined") {
            localStorage.setItem(THEME_STORAGE_KEY, theme);
        }

        if (!hasThemeMountedRef.current) {
            hasThemeMountedRef.current = true;
            return;
        }

        root.classList.add("theme-transition");
        const timer = window.setTimeout(() => {
            root.classList.remove("theme-transition");
        }, 1000);

        return () => {
            window.clearTimeout(timer);
            root.classList.remove("theme-transition");
        };
    }, [theme]);

// адаптив: только определяем, мобильный layout или нет
    useEffect(() => {
        if (typeof window === "undefined") return;

        const handleResize = () => {
            const mobile = window.innerWidth <= MOBILE_BREAKPOINT;
            setIsMobile(mobile);
        };

        handleResize(); // первый запуск при монтировании
        window.addEventListener("resize", handleResize);

        return () => {
            window.removeEventListener("resize", handleResize);
        };
    }, []);

    if (!tabsForLevel[currentTab]) {
        const firstKey = Object.keys(tabsForLevel)[0];
        setCurrentTab(firstKey);
        return null;
    }

    const { component: Component, storageKey } = tabsForLevel[currentTab];

    const instructions = Component.instructions?.[locale];
    const headerButton = Component.headerButton;
    const isDarkTheme = theme === "dark";

    const handleClearAnswers = () => {
        if (!storageKey) return;
        clearAnswersByStorageKey(storageKey);
    };

    const closeSidebar = () => setIsSidebarOpen(false);
    const openSidebar = () => setIsSidebarOpen(true);

    useColoredInputs(currentTab);

    // ---------- SIDEBAR (одна разметка для desktop + mobile) ----------

    const sidebar = (
        <motion.aside
            key="sidebar"
            className={`sidebar ${
                isMobile ? "sidebar--mobile" : "sidebar--desktop"
            } ${!isMobile && !isSidebarOpen ? "sidebar--collapsed" : ""}`}
            {...(isMobile
                ? {
                    initial: {opacity: 0, x: -20},
                    animate: {opacity: 1, x: 0},
                    exit: {opacity: 0, x: -20},
                    transition: {duration: 0.2, ease: "easeOut"},
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
                        <Settings size={25} className="sidebar-settings-icon"/>
                        <span className="sidebar-settings-label-text">
                            {labels.settings}
                        </span>
                    </button>

                    <button
                        type="button"
                        className="sidebar-close-icon-button"
                        onClick={closeSidebar}
                    >
                        <ArrowLeft size={25}/>
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
                                <option value="A1.2">A1.2</option>
                                <option value="A2">A2 in progress</option>
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

                            <div className="sidebar-settings-row sidebar-settings-row--mt sidebar-settings-row--between">
                                <span className="sidebar-settings-row-label">
                                    <Palette size={30}/>
                                    <span>{labels.theme}</span>
                                </span>
                                <button
                                    type="button"
                                    className={`theme-toggle ${
                                        isDarkTheme ? "theme-toggle--dark" : ""
                                    }`}
                                    onClick={() =>
                                        setTheme((prev) => (prev === "dark" ? "light" : "dark"))
                                    }
                                    aria-label={labels.theme}
                                    aria-pressed={isDarkTheme}
                                >
                                    <span className="theme-toggle__thumb"/>
                                </button>
                            </div>
                        </div>
                    </motion.div>

                    {/* СПИСОК УПРАЖНЕНИЙ */}
                    <div className="sidebar-exercises">
                        <div className="sidebar-exercises-inner">
                            {Object.keys(tabsForLevel).map((key) => {
                                const isActive = currentTab === key;
                                const label = tabsForLevel[key]?.label;

                                return (
                                    <motion.button
                                        key={key}
                                        type="button"
                                        className={`sidebar-tab sidebar-tab--${key} ${
                                            isActive ? "sidebar-tab--active" : ""
                                        }`}
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
                                        <span className="sidebar-tab-label">{label}</span>
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

    const mainContent = (
        <>
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
                    <p className="app-header-subtitle">{instructions}</p>
                </div>

                <div className="app-header-right">{headerButton}</div>
            </header>

            <main className="exercise-container">
                <div ref={contentRef} className="exercise-card fade-in">
                    <div className="exercise-scroll">
                        <Component key={currentTab}/>
                    </div>
                </div>
            </main>
        </>
    );

    const main = (
        <div className="main">
            {mainContent}
        </div>
    );

    const mobileMain = (
        <motion.div
            key="main"
            className="main main--mobile-panel"
            initial={{opacity: 0, x: 20}}
            animate={{opacity: 1, x: 0}}
            exit={{opacity: 0, x: 20}}
            transition={{duration: 0.2, ease: "easeOut"}}
        >
            {mainContent}
        </motion.div>
    );

    // ---------- MOBILE: полноэкранный сайдбар или контент ----------

    if (isMobile) {
        return (
            <div className="app-layout app-layout--mobile">
                <div className="mobile-stage">
                    <AnimatePresence initial={false} mode="sync">
                        {isSidebarOpen ? sidebar : mobileMain}
                    </AnimatePresence>
                </div>
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
