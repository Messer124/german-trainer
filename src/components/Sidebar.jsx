import { useLocale } from "../contexts/LocaleContext";
import { useLevel } from "../contexts/LevelContext";
import translations from "../locales/locales";
import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";
import { Globe2, BookOpen, Settings, ChevronDown } from "lucide-react";
import "../css/components/Sidebar.css";

export default function Sidebar({ currentTab, setCurrentTab, tabTitles, tabs, locale, onClearAnswers, onWidthChange, headerButton, instructions }) {
    const { level, setLevel } = useLevel();
    const { setLocale } = useLocale();
    const labels = translations[locale].labels;
    const [isMobile, setIsMobile] = useState(false);
    const [isOpen, setIsOpen] = useState(true);
    const [settingsOpen, setSettingsOpen] = useState(false);

    useEffect(() => {
        const checkMobile = () => setIsMobile(window.innerWidth < 768);
        checkMobile();
        window.addEventListener("resize", checkMobile);
        return () => window.removeEventListener("resize", checkMobile);
    }, []);

    const sidebarWidth = isMobile && !isOpen ? "0px" : isMobile ? "40%" : "250px";

    useEffect(() => {
        if (onWidthChange) onWidthChange(sidebarWidth);
    }, [sidebarWidth]);

    return (
        <>
            {/* Фиксированная шапка */}
            <div
                className="sidebar-header"
                style={{ left: isMobile ? 0 : sidebarWidth }}
            >
                <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                    {isMobile && !isOpen && (
                        <button onClick={() => setIsOpen(true)} className="sidebar-burger">
                            ☰
                        </button>
                    )}

                    <div>
                        <h1>{tabTitles[currentTab]}</h1>
                        {typeof instructions !== "undefined" && (
                            <p>{instructions}</p>
                        )}
                    </div>
                </div>

                {typeof headerButton !== "undefined" && <div>{headerButton}</div>}
            </div>

            {/* Боковая панель */}
            <AnimatePresence>
                {(!isMobile || isOpen) && (
                    <motion.div
                        key="sidebar"
                        initial={{ x: -300, opacity: 0 }}
                        animate={{ x: 0, opacity: 1 }}
                        exit={{ x: -300, opacity: 0 }}
                        transition={{ duration: 0.3, ease: "easeInOut" }}
                        className="sidebar-panel"
                        style={{ width: sidebarWidth }}
                    >
                        {isMobile && (
                            <button
                                onClick={() => setIsOpen(false)}
                                className="sidebar-close-button"
                            >
                                ✕
                            </button>
                        )}

                        <div style={{ marginBottom: 24 }}>
                            <button
                                onClick={() => setSettingsOpen(!settingsOpen)}
                                className="sidebar-settings-button"
                            >
                                <Settings size={isMobile ? 22 : 16} />
                                {locale === "ru" ? "Настройки" : "Settings"}
                                <ChevronDown
                                    size={16}
                                    style={{
                                        marginLeft: "auto",
                                        transition: "transform 0.3s",
                                        transform: settingsOpen ? "rotate(180deg)" : "none"
                                    }}
                                />
                            </button>

                            <AnimatePresence>
                                {settingsOpen && (
                                    <motion.div
                                        initial={{ opacity: 0, height: 0 }}
                                        animate={{ opacity: 1, height: "auto" }}
                                        exit={{ opacity: 0, height: 0 }}
                                        transition={{ duration: 0.3 }}
                                        className="sidebar-settings-dropdown"
                                    >
                                        <label className="sidebar-settings-label">
                                            <BookOpen size={16} /> {labels.level}
                                        </label>
                                        <select
                                            value={level}
                                            onChange={(e) => setLevel(e.target.value)}
                                            className="sidebar-select"
                                        >
                                            <option value="A1">A1</option>
                                            <option value="A2">A2</option>
                                        </select>

                                        <label
                                            className="sidebar-settings-label"
                                            style={{ marginTop: 12 }}
                                        >
                                            <Globe2 size={16} /> {labels.language}
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

                        {/* Центр: вкладки */}
                        <div className="sidebar-tabs">
                            {Object.keys(tabs).map((key) => (
                                <motion.div
                                    key={key}
                                    onClick={() => {
                                        setCurrentTab(key);
                                        if (isMobile) setIsOpen(false);
                                    }}
                                    initial={{ opacity: 0, x: -10 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    whileHover={{ scale: 1.02 }}
                                    className={`tab-item ${currentTab === key ? "active" : ""}`}
                                >
                                    {tabTitles[key]}
                                </motion.div>
                            ))}
                        </div>

                        {/* Низ: Очистить */}
                        <motion.button
                            whileHover={{
                                scale: 1.05,
                                backgroundColor: "#4ea1f3",
                                color: "white"
                            }}
                            transition={{ type: "spring", stiffness: 300 }}
                            onClick={onClearAnswers}
                            className="sidebar-clear-button"
                        >
                            {labels.clearAnswers}
                        </motion.button>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
}