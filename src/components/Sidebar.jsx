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
            {/* ФИКСИРОВАННАЯ ШАПКА */}
            <div
                style={{
                    position: "fixed",
                    top: 0,
                    left: isMobile ? 0 : sidebarWidth,
                    right: 0,
                    height: 80,
                    background: "#ffffffcc",
                    backdropFilter: "blur(10px)",
                    borderBottom: "3px solid #3b82f6",
                    zIndex: 900,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    padding: "0 24px",
                    boxSizing: "border-box",
                    boxShadow: "0 2px 6px rgba(0, 0, 0, 0.03)"
                }}
            >
                {/* Левая часть: бургер + заголовок */}
                <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                    {isMobile && !isOpen && (
                        <button
                            onClick={() => setIsOpen(true)}
                            style={{
                                background: "#fff",
                                border: "1px solid #ccc",
                                borderRadius: 8,
                                padding: "6px 10px",
                                fontSize: 18,
                                cursor: "pointer",
                                boxShadow: "0 2px 4px rgba(0, 0, 0, 0.05)"
                            }}
                        >
                            ☰
                        </button>
                    )}

                    <div>
                        <h1 style={{ fontSize: 20, fontWeight: 700, margin: 5 }}>
                            {tabTitles[currentTab]}
                        </h1>
                        {typeof instructions !== "undefined" && (
                            <p style={{ fontSize: 16, margin: 4, color: "#666" }}>
                                {instructions}
                            </p>
                        )}
                    </div>
                </div>

                {/* Правая часть: кнопка */}
                {typeof headerButton !== "undefined" && <div>{headerButton}</div>}
            </div>



            <AnimatePresence>
                {(!isMobile || isOpen) && (
                    <motion.div
                        key="sidebar"
                        initial={{x: -300, opacity: 0}}
                        animate={{x: 0, opacity: 1}}
                        exit={{x: -300, opacity: 0}}
                        transition={{duration: 0.3, ease: "easeInOut"}}
                        style={{
                            position: "fixed",
                            top: 0,
                            left: 0,
                            height: "100vh",
                            width: sidebarWidth,
                            background: "rgba(255, 255, 255, 0.85)",
                            backdropFilter: "blur(10px)",
                            boxShadow: "inset 0 0 8px rgba(0, 0, 0, 0.04), 4px 0 12px rgba(0, 0, 0, 0.1)",
                            borderTopRightRadius: 16,
                            borderBottomRightRadius: 16,
                            display: "flex",
                            flexDirection: "column",
                            justifyContent: "space-between",
                            padding: "16px",
                            boxSizing: "border-box",
                            overflow: "hidden",
                            zIndex: 1000
                        }}
                    >
                        {isMobile && (
                            <button
                                onClick={() => setIsOpen(false)}
                                style={{
                                    alignSelf: "flex-end",
                                    background: "transparent",
                                    border: "none",
                                    fontSize: 20,
                                    cursor: "pointer",
                                    marginBottom: 8
                                }}
                            >
                                ✕
                            </button>
                        )}

                        <div style={{ marginBottom: 24 }}>
                            <button
                                onClick={() => setSettingsOpen(!settingsOpen)}
                                style={{
                                    display: "flex",
                                    alignItems: "center",
                                    gap: 8,
                                    width: "100%",
                                    background: "#f0f0f0",
                                    border: "none",
                                    borderRadius: 8,
                                    padding: "10px 14px",
                                    fontWeight: 600,
                                    fontSize: 14,
                                    cursor: "pointer"
                                }}
                            >
                                <Settings size={16} /> {locale === "ru" ? "Настройки" : "Settings"} <ChevronDown size={16} style={{ marginLeft: "auto", transition: "transform 0.3s", transform: settingsOpen ? "rotate(180deg)" : "none" }} />
                            </button>

                            <AnimatePresence>
                                {settingsOpen && (
                                    <motion.div
                                        initial={{ opacity: 0, height: 0 }}
                                        animate={{ opacity: 1, height: "auto" }}
                                        exit={{ opacity: 0, height: 0 }}
                                        transition={{ duration: 0.3 }}
                                        style={{ overflow: "hidden", marginTop: 8, background: "#f0f0f0", borderRadius: 8, padding: "12px" }}
                                    >
                                        <label style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 14, fontWeight: 600, marginBottom: 4 }}>
                                            <BookOpen size={16} /> {labels.level}
                                        </label>
                                        <select value={level} onChange={(e) => setLevel(e.target.value)} style={{ width: "100%", padding: "8px 10px", borderRadius: 6, border: "1px solid #ccc", background: "white", fontSize: 14 }}>
                                            <option value="A1">A1</option>
                                            <option value="A2">A2</option>
                                        </select>

                                        <label style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 14, fontWeight: 600, marginTop: 12, marginBottom: 4 }}>
                                            <Globe2 size={16} /> {labels.language}
                                        </label>
                                        <select value={locale} onChange={(e) => setLocale(e.target.value)} style={{ width: "100%", padding: "8px 10px", borderRadius: 6, border: "1px solid #ccc", background: "white", fontSize: 14, transition: "all 0.3s ease" }}>
                                            <option value="ru">Русский</option>
                                            <option value="en">English</option>
                                        </select>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>

                        {/* Центр: вкладки */}
                        <div style={{ flexGrow: 1, overflowY: "auto", marginBottom: 24 }}>
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
                                    style={{
                                        cursor: "pointer",
                                        padding: "10px 14px",
                                        borderRadius: 8,
                                        background: currentTab === key ? "#dbeafe" : "transparent",
                                        fontWeight: currentTab === key ? 600 : 400,
                                        color: currentTab === key ? "#1d4ed8" : "#333",
                                        marginBottom: 6,
                                        transition: "all 0.2s ease"
                                    }}
                                >
                                    {tabTitles[key]}
                                </motion.div>
                            ))}
                        </div>

                        {/* Низ: Очистить */}
                        <motion.button
                            whileHover={{ scale: 1.05, backgroundColor: "#4ea1f3", color: "white" }}
                            transition={{ type: "spring", stiffness: 300 }}
                            onClick={onClearAnswers}
                            style={{
                                padding: 10,
                                background: "#e0e0e0",
                                border: "none",
                                borderRadius: 8,
                                fontWeight: 600,
                                color: "#333",
                                cursor: "pointer",
                                transition: "all 0.1s ease"
                            }}
                        >
                            {labels.clearAnswers}
                        </motion.button>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
}
