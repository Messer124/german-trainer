import { Suspense, useState, useEffect, useRef } from "react";
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
import { usePerformanceMode } from "./hooks/usePerformanceMode";
import "./css/App.css";

const DEFAULT_LEVEL = "A1.1";
const MOBILE_BREAKPOINT = 600;
const THEME_STORAGE_KEY = "app-theme";

function getTabsForLevel(level) {
    return EXERCISES_BY_LEVEL[level] || EXERCISES_BY_LEVEL[DEFAULT_LEVEL];
}

function requestIdleTask(callback, timeout) {
    if (typeof window === "undefined") return null;

    if ("requestIdleCallback" in window) {
        const id = window.requestIdleCallback(callback, { timeout });
        return () => window.cancelIdleCallback(id);
    }

    const id = window.setTimeout(callback, timeout);
    return () => window.clearTimeout(id);
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
    const performanceMode = usePerformanceMode();
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
    const isLowPerformanceMode = performanceMode === "low";

    useEffect(() => {
        if (typeof document === "undefined") return;

        document.documentElement.setAttribute("data-performance", performanceMode);
    }, [performanceMode]);

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

        if (performanceMode === "low") return;

        const node = contentRef.current;
        if (!node) return;

        node.classList.remove("fade-in");
        void node.offsetWidth;
        node.classList.add("fade-in");
    }, [currentTab, level, performanceMode]);

    useEffect(() => {
        if (typeof window === "undefined") return undefined;

        const exercises = Object.values(getTabsForLevel(level)).filter((item) => typeof item?.load === "function");
        const initialDelay = isLowPerformanceMode ? 1800 : 700;
        const idleTimeout = isLowPerformanceMode ? 2200 : 900;
        const betweenLoadsDelay = isLowPerformanceMode ? 700 : 180;
        let cancelled = false;
        let index = 0;
        let cancelIdle = null;
        let delayTimer = null;

        const scheduleNext = () => {
            if (cancelled || index >= exercises.length || document.visibilityState === "hidden") return;

            cancelIdle = requestIdleTask(() => {
                if (cancelled || index >= exercises.length) return;

                const exercise = exercises[index];
                index += 1;
                exercise.load().catch(() => {
                    // Prefetch is opportunistic: failed chunks will be loaded normally on demand.
                });

                delayTimer = window.setTimeout(scheduleNext, betweenLoadsDelay);
            }, idleTimeout);
        };

        delayTimer = window.setTimeout(scheduleNext, initialDelay);

        return () => {
            cancelled = true;
            cancelIdle?.();
            window.clearTimeout(delayTimer);
        };
    }, [level, isLowPerformanceMode]);

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

    useEffect(() => {
        if (typeof document === "undefined") return;

        const handleEnterFocus = (event) => {
            if (event.key !== "Enter" || event.defaultPrevented || event.isComposing) return;
            if (event.shiftKey || event.altKey || event.ctrlKey || event.metaKey) return;

            const target = event.target;
            if (!(target instanceof HTMLInputElement)) return;
            if (target.disabled || target.readOnly) return;

            const scope = target.closest(".exercise-card") ?? document;
            const inputs = Array.from(
                scope.querySelectorAll("input:not([type='hidden']):not([disabled]):not([readonly])")
            ).filter((input) => input.offsetParent !== null);

            const currentIndex = inputs.indexOf(target);
            if (currentIndex === -1 || currentIndex === inputs.length - 1) return;

            event.preventDefault();

            const nextInput = inputs[currentIndex + 1];
            nextInput.focus();
            nextInput.select?.();
        };

        document.addEventListener("keydown", handleEnterFocus);
        return () => {
            document.removeEventListener("keydown", handleEnterFocus);
        };
    }, [currentTab]);

    useEffect(() => {
        if (typeof document === "undefined") return;

        const keepKeyboardOpenOnEyeTap = (event) => {
            const eyeButton = event.target instanceof Element
                ? event.target.closest(".eye-container--button, .hint-button, .expanding-input__eye-button")
                : null;

            if (eyeButton) {
                event.preventDefault();
            }
        };

        document.addEventListener("pointerdown", keepKeyboardOpenOnEyeTap, { capture: true });

        return () => {
            document.removeEventListener("pointerdown", keepKeyboardOpenOnEyeTap, { capture: true });
        };
    }, []);

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

    const currentExercise = tabsForLevel[currentTab];
    const { component: Component, storageKey, hasHint } = currentExercise;

    const instructions = currentExercise.instructions?.[locale];
    const headerButton = hasHint ? (
        <button
            type="button"
            className="hint-button"
            data-modal-open="true"
            onClick={() => document.dispatchEvent(new CustomEvent("show-hint"))}
            aria-label={locale === "en" ? "Show hint" : "Показать подсказку"}
        >
            !
        </button>
    ) : null;
    const isDarkTheme = theme === "dark";

    const handleClearAnswers = () => {
        if (!storageKey) return;
        clearAnswersByStorageKey(storageKey);
    };

    const closeSidebar = () => setIsSidebarOpen(false);
    const openSidebar = () => setIsSidebarOpen(true);

    useColoredInputs(currentTab);

    // ---------- SIDEBAR (одна разметка для desktop + mobile) ----------

    const settingsDropdownContent = (
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
                <option value="A2">A2</option>
                {/*<option value="B1">B1 in progress</option>*/}
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
    );

    const SidebarComponent = isLowPerformanceMode ? "aside" : motion.aside;

    const sidebar = (
        <SidebarComponent
            key="sidebar"
            className={`sidebar ${
                isMobile ? "sidebar--mobile" : "sidebar--desktop"
            } ${!isMobile && !isSidebarOpen ? "sidebar--collapsed" : ""}`}
            {...(!isLowPerformanceMode && isMobile
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
                    {isLowPerformanceMode ? (
                        settingsOpen ? (
                            <div className="sidebar-settings-dropdown-wrapper sidebar-settings-dropdown-wrapper--static">
                                {settingsDropdownContent}
                            </div>
                        ) : null
                    ) : (
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
                            {settingsDropdownContent}
                        </motion.div>
                    )}

                    {/* СПИСОК УПРАЖНЕНИЙ */}
                    <div className="sidebar-exercises">
                        <div className="sidebar-exercises-inner">
                            {Object.keys(tabsForLevel).map((key) => {
                                const isActive = currentTab === key;
                                const exerciseItem = tabsForLevel[key];
                                const label = exerciseItem?.title?.[locale] ?? key;
                                const prefetchExercise = () => exerciseItem?.load?.();

                                const TabButton = isLowPerformanceMode ? "button" : motion.button;

                                return (
                                    <TabButton
                                        key={key}
                                        type="button"
                                        className={`sidebar-tab sidebar-tab--${key} ${
                                            isActive ? "sidebar-tab--active" : ""
                                        }`}
                                        onMouseEnter={prefetchExercise}
                                        onFocus={prefetchExercise}
                                        onClick={() => {
                                            prefetchExercise();
                                            setCurrentTab(key);
                                            if (isMobile) closeSidebar();
                                        }}
                                        {...(!isLowPerformanceMode
                                            ? {
                                                initial: {opacity: 0, x: -10},
                                                animate: {opacity: 1, x: 0},
                                            }
                                            : {})}
                                    >
                                        {isActive && (isLowPerformanceMode ? (
                                            <div className="sidebar-tab-active-bg"/>
                                        ) : (
                                            <motion.div
                                                className="sidebar-tab-active-bg"
                                                layoutId="sidebar-active-bg"
                                                transition={{
                                                    type: "spring",
                                                    stiffness: 400,
                                                    damping: 30,
                                                }}
                                            />
                                        ))}
                                        <span className="sidebar-tab-label">{label}</span>
                                    </TabButton>
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
        </SidebarComponent>
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
                        <Suspense
                            fallback={
                                <div className="exercise-loading">
                                    {locale === "en" ? "Loading exercise..." : "Загрузка упражнения..."}
                                </div>
                            }
                        >
                            <Component key={currentTab}/>
                        </Suspense>
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

    const mobileMain = isLowPerformanceMode ? (
        <div key="main" className="main main--mobile-panel">
            {mainContent}
        </div>
    ) : (
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
                    {isLowPerformanceMode ? (
                        isSidebarOpen ? sidebar : mobileMain
                    ) : (
                        <AnimatePresence initial={false} mode="sync">
                            {isSidebarOpen ? sidebar : mobileMain}
                        </AnimatePresence>
                    )}
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
