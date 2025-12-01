import { useLocale } from "../contexts/LocaleContext";
import { useLevel } from "../contexts/LevelContext";
import translations from "../locales/locales";
import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect, useRef, useLayoutEffect } from "react";
import { Globe2, BookOpen, Settings, ChevronDown } from "lucide-react";
import "../css/components/Sidebar.css";

export default function Sidebar({
                                    currentTab,
                                    setCurrentTab,
                                    tabTitles,
                                    tabs,
                                    locale,
                                    onClearAnswers,
                                    onWidthChange,
                                    headerButton,
                                    instructions,
                                    headerTitle,
                                    onHeaderHeight,
                                    onHeaderCardWidth,
                                }) {
    const { level, setLevel } = useLevel();
    const { setLocale } = useLocale();
    const labels = translations[locale].labels;

    const [isMobile, setIsMobile] = useState(false);
    const [isOpen, setIsOpen] = useState(true);
    const [settingsOpen, setSettingsOpen] = useState(false);

    const headerRef = useRef(null);
    const headerCardRef = useRef(null);

    /* вычисляем высоту хедера для контента */
    useEffect(() => {
        if (!headerRef.current || !onHeaderHeight) return;

        const observer = new ResizeObserver(() => {
            if (headerRef.current) {
                onHeaderHeight(headerRef.current.offsetHeight);
            }
        });

        observer.observe(headerRef.current);
        return () => observer.disconnect();
    }, [onHeaderHeight]);

    useLayoutEffect(() => {
        if (headerCardRef.current && typeof onHeaderCardWidth === "function") {
            onHeaderCardWidth(headerCardRef.current.offsetWidth);
        }
    });

    /* адаптив: мобилка / десктоп */
    useEffect(() => {
        const checkMobile = () => setIsMobile(window.innerWidth < 768);
        checkMobile();

        window.addEventListener("resize", checkMobile);
        return () => window.removeEventListener("resize", checkMobile);
    }, []);

    const sidebarWidth = isMobile && !isOpen ? "0px" : isMobile ? "40%" : "250px";

    useEffect(() => {
        if (onWidthChange) {
            onWidthChange(sidebarWidth);
        }
    }, [sidebarWidth, onWidthChange]);

    return (
        <>
            {/* Фиксированная шапка над основной областью */}
            <div
                ref={headerRef}
                className="sidebar-header"
                style={{left: isMobile ? 0 : sidebarWidth}}
            >
                <div className="header-inner">
                    <div className="header-card"  ref={headerCardRef}>
                        <div className="header-card-main">
                            {isMobile && !isOpen && (
                                <button
                                    onClick={() => setIsOpen(true)}
                                    className="sidebar-burger header-burger-inside"
                                >
                                    ☰
                                </button>
                            )}

                            <div className="header-card-text">
                                <h1 className="header-card-title">{headerTitle}</h1>
                                <p className="header-card-subtitle">{instructions}</p>
                            </div>
                        </div>

                        {headerButton && <div className="header-card-right">{headerButton}</div>}
                    </div>
                </div>
            </div>

            {/* Сайдбар слева */}
            <AnimatePresence>
                {(!isMobile || isOpen) && (
                    <motion.div
                        key="sidebar"
                        initial={{x: -300, opacity: 0}}
                        animate={{x: 0, opacity: 1}}
                        exit={{x: -300, opacity: 0}}
                        transition={{duration: 0.3}}
                        className="sidebar-panel"
                        style={{width: sidebarWidth}}
                    >
                        {isMobile && (
                            <button
                                onClick={() => setIsOpen(false)}
                                className="sidebar-close-button"
                            >
                                ✕
                            </button>
                        )}

                        {/* Блок настроек */}
                        <div style={{marginBottom: 16}}>
                            <button
                                onClick={() => setSettingsOpen((prev) => !prev)}
                                className="sidebar-settings-button"
                            >
                                <Settings size={16}/>
                                {locale === "ru" ? "Настройки" : "Settings"}
                                <ChevronDown
                                    size={16}
                                    style={{
                                        marginLeft: "auto",
                                        transition: "transform 0.3s",
                                        transform: settingsOpen ? "rotate(180deg)" : "none",
                                    }}
                                />
                            </button>

                            <AnimatePresence>
                                {settingsOpen && (
                                    <motion.div
                                        initial={{opacity: 0, height: 0}}
                                        animate={{opacity: 1, height: "auto"}}
                                        exit={{opacity: 0, height: 0}}
                                        transition={{duration: 0.3}}
                                        className="sidebar-settings-dropdown"
                                    >
                                        <label className="sidebar-settings-label">
                                            <BookOpen size={16}/> {labels.level}
                                        </label>

                                        <select
                                            value={level}
                                            onChange={(e) => setLevel(e.target.value)}
                                            className="sidebar-select"
                                        >
                                            <option value="A1.1">A1.1</option>
                                            <option value="A1.2">A1.2 in progress</option>
                                        </select>

                                        <label
                                            className="sidebar-settings-label"
                                            style={{marginTop: 12}}
                                        >
                                            <Globe2 size={16}/> {labels.language}
                                        </label>

                                        <select
                                            value={locale}
                                            onChange={(e) => setLocale(e.target.value)}
                                            className="sidebar-select"
                                        >
                                            <option value="ru">Русский</option>
                                            <option value="en">English</option>
                                        </select>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>

                        {/* Список упражнений */}
                        <div className="sidebar-tabs">
                            <div className="sidebar-tabs-group">
                                {Object.keys(tabs).map((key) => {
                                    const isActive = currentTab === key;

                                    return (
                                        <motion.button
                                            key={key}
                                            type="button"
                                            onClick={() => {
                                                setCurrentTab(key);
                                                if (isMobile) setIsOpen(false);
                                            }}
                                            className={`tab-item ${isActive ? "active" : ""}`}
                                            initial={{opacity: 0, x: -10}}
                                            animate={{opacity: 1, x: 0}}
                                        >
                                            {isActive && (
                                                <motion.div
                                                    className="tab-item-active-bg"
                                                    layoutId="sidebar-active-bg"
                                                    transition={{
                                                        type: "spring",
                                                        stiffness: 400,
                                                        damping: 30,
                                                    }}
                                                />
                                            )}

                                            <span className="tab-item-label">
                                                {tabTitles[key]}
                                            </span>
                                        </motion.button>
                                    );
                                })}
                            </div>
                        </div>

                        {/* кнопка очистки */}
                        <div style={{marginTop: 12}}>
                            <motion.button
                                className="sidebar-clear-button"
                                whileTap={{scale: 0.97}}
                                onClick={onClearAnswers}
                            >
                                {labels.clearAnswers}
                            </motion.button>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
}
