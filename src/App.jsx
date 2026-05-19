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
import { loadExercisesForLevel } from "./config/exercises";
import { useColoredInputs } from "./hooks/useColoredInputs";
import { clearAnswersByStorageKey } from "./hooks/usePersistentAnswers";
import "./css/App.css";

const MOBILE_BREAKPOINT = 600;
const THEME_STORAGE_KEY = "app-theme";
const SETTINGS_OPEN_STORAGE_KEY = "sidebar-settings-open";
const BROWSER_THEME_COLORS = {
    light: "#ffffff",
    dark: "#202124",
};
const DOCUMENT_THEME_BACKGROUNDS = {
    light: "#f2f2f7",
    dark: "#050b1f",
};
const IOS_STATUS_BAR_STYLES = {
    light: "default",
    dark: "black-translucent",
};
const THEME_TRANSITION_DURATION_MS = 1000;

function setOrCreateMeta(name, content, { id } = {}) {
    if (typeof document === "undefined") return;

    let meta = id
        ? document.getElementById(id)
        : document.querySelector(`meta[name="${name}"]`);

    if (!meta) {
        meta = document.createElement("meta");
        if (id) {
            meta.setAttribute("id", id);
        }
        meta.setAttribute("name", name);
        document.head.appendChild(meta);
    }

    meta.setAttribute("content", content);
    return meta;
}

function syncThemeColorMeta(browserTheme) {
    const lightMeta = setOrCreateMeta(
        "theme-color",
        BROWSER_THEME_COLORS.light,
        { id: "app-theme-color-light" }
    );
    const darkMeta = setOrCreateMeta(
        "theme-color",
        BROWSER_THEME_COLORS.dark,
        { id: "app-theme-color-dark" }
    );

    lightMeta.setAttribute("media", browserTheme === "dark" ? "not all" : "all");
    darkMeta.setAttribute("media", browserTheme === "dark" ? "all" : "not all");
}

function syncBrowserTheme(theme) {
    if (typeof document === "undefined") return;

    const browserTheme = theme === "dark" ? "dark" : "light";
    const fallbackTheme = browserTheme === "dark" ? "light" : "dark";
    const colorScheme = `${browserTheme} ${fallbackTheme}`;

    document.documentElement.style.colorScheme = browserTheme;
    document.documentElement.style.backgroundColor = DOCUMENT_THEME_BACKGROUNDS[browserTheme];
    document.body.style.colorScheme = browserTheme;
    document.body.style.backgroundColor = DOCUMENT_THEME_BACKGROUNDS[browserTheme];

    setOrCreateMeta("color-scheme", colorScheme, { id: "app-color-scheme" });
    setOrCreateMeta("supported-color-schemes", colorScheme, { id: "app-supported-color-schemes" });
    syncThemeColorMeta(browserTheme);
    setOrCreateMeta("apple-mobile-web-app-status-bar-style", IOS_STATUS_BAR_STYLES[browserTheme], { id: "app-ios-status-bar-style" });
}

export default function App() {
    const { locale, setLocale } = useLocale();
    const { level, setLevel } = useLevel();

    const [tabsForLevel, setTabsForLevel] = useState({});
    const [currentTab, setCurrentTab] = useState(null);
    const [isLevelLoading, setIsLevelLoading] = useState(true);
    const [levelLoadError, setLevelLoadError] = useState(null);
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);
    const [settingsOpen, setSettingsOpen] = useState(() => {
        if (typeof window === "undefined") {
            return true;
        }

        const savedSettingsOpen = localStorage.getItem(SETTINGS_OPEN_STORAGE_KEY);
        return savedSettingsOpen === null ? true : savedSettingsOpen === "true";
    });
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
    const shouldReloadAfterThemeTransitionRef = useRef(false);
    const labels = translations[locale].labels;

    const handleThemeToggle = () => {
        const nextTheme = theme === "dark" ? "light" : "dark";

        if (typeof window !== "undefined") {
            localStorage.setItem(THEME_STORAGE_KEY, nextTheme);
        }

        shouldReloadAfterThemeTransitionRef.current = true;
        setTheme(nextTheme);
    };

    // Загружаем весь выбранный уровень целиком.
    useEffect(() => {
        let cancelled = false;

        setIsLevelLoading(true);
        setLevelLoadError(null);

        loadExercisesForLevel(level)
            .then((tabs) => {
                if (cancelled) return;

                setTabsForLevel(tabs);
                setCurrentTab(() => {
                    const keys = Object.keys(tabs);

                    if (typeof window !== "undefined") {
                        const savedTab = localStorage.getItem(`last-tab-${level}`);
                        if (savedTab && tabs[savedTab]) {
                            return savedTab;
                        }
                    }

                    return keys[0] ?? null;
                });
            })
            .catch((error) => {
                if (cancelled) return;
                setTabsForLevel({});
                setCurrentTab(null);
                setLevelLoadError(error);
            })
            .finally(() => {
                if (!cancelled) {
                    setIsLevelLoading(false);
                }
            });

        return () => {
            cancelled = true;
        };
    }, [level]);

    useEffect(() => {
        if (!currentTab) return;

        if (!tabsForLevel[currentTab]) {
            const firstKey = Object.keys(tabsForLevel)[0] ?? null;
            if (firstKey !== currentTab) {
                setCurrentTab(firstKey);
            }
        }
    }, [currentTab, tabsForLevel]);

    // сохранение выбора и анимация контента упражнения
    useEffect(() => {
        if (!currentTab) return;

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
        if (typeof window === "undefined") return;

        localStorage.setItem(SETTINGS_OPEN_STORAGE_KEY, String(settingsOpen));
    }, [settingsOpen]);

    useEffect(() => {
        if (typeof document === "undefined") return;

        const root = document.documentElement;
        root.setAttribute("data-theme", theme);
        syncBrowserTheme(theme);

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

            if (shouldReloadAfterThemeTransitionRef.current) {
                shouldReloadAfterThemeTransitionRef.current = false;
                window.location.reload();
            }
        }, THEME_TRANSITION_DURATION_MS);

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
                ? event.target.closest(".eye-container--button, .hint-button, .help-pill, .expanding-input__eye-button")
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

    const currentExercise = currentTab ? tabsForLevel[currentTab] : null;
    const CurrentComponent = currentExercise?.component;
    const storageKey = currentExercise?.storageKey;
    const hasHint = currentExercise?.hasHint ?? false;

    const instructions = currentExercise?.instructions?.[locale] ?? "";
    const headerButton = hasHint ? (
        <button
            type="button"
            className="help-pill"
            data-modal-open="true"
            onClick={() => document.dispatchEvent(new CustomEvent("show-hint"))}
        >
            <span className="help-pill__icon" aria-hidden="true">i</span>
            <span className="help-pill__label">
                {locale === "en" ? "Info" : "Теория"}
            </span>
        </button>
    ) : null;
    const isDarkTheme = theme === "dark";

    const handleClearAnswers = () => {
        if (!storageKey) return;
        clearAnswersByStorageKey(storageKey);
    };

    const closeSidebar = () => setIsSidebarOpen(false);
    const openSidebar = () => setIsSidebarOpen(true);

    useColoredInputs();

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
                <option value="B1">B1</option>
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
                    onClick={handleThemeToggle}
                    aria-label={labels.theme}
                    aria-pressed={isDarkTheme}
                >
                    <span className="theme-toggle__thumb"/>
                </button>
            </div>
        </div>
    );

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
                        {settingsDropdownContent}
                    </motion.div>

                    {/* СПИСОК УПРАЖНЕНИЙ */}
                    <div className="sidebar-exercises">
                        <div className="sidebar-exercises-inner">
                            {Object.keys(tabsForLevel).map((key) => {
                                const isActive = currentTab === key;
                                const exerciseItem = tabsForLevel[key];
                                const label = exerciseItem?.title?.[locale] ?? key;

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

    const exerciseLoading = (
        <div className="exercise-loading">
            {locale === "en" ? "Loading exercise..." : "Загрузка упражнения..."}
        </div>
    );

    const emptyLevelMessage = (
        <div className="exercise-loading">
            {locale === "en" ? "No exercises in this level yet." : "На этом уровне пока нет упражнений."}
        </div>
    );

    const levelErrorMessage = (
        <div className="exercise-loading">
            {locale === "en" ? "Could not load this level." : "Не удалось загрузить этот уровень."}
        </div>
    );

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
                        {isLevelLoading
                            ? exerciseLoading
                            : levelLoadError
                                ? levelErrorMessage
                                : CurrentComponent
                                    ? <CurrentComponent key={currentTab}/>
                                    : emptyLevelMessage}
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
