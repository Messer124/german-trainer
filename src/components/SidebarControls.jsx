import { useLevel } from "../contexts/LevelContext";
import { useLocale } from "../contexts/LocaleContext";
import translations from "../locales/locales";

export default function SidebarControls() {
    const { level, setLevel } = useLevel();
    const { locale, setLocale } = useLocale();
    const labels = translations[locale].labels;

    return (
        <div style={{ padding: "10px", display: "flex", flexDirection: "column", gap: "16px" }}>
            {/* Уровень языка */}
            <label style={{ fontSize: 14, fontWeight: 600 }}>
                {labels.level}
                <select
                    value={level}
                    onChange={(e) => setLevel(e.target.value)}
                    style={{
                        width: "100%",
                        padding: "6px",
                        marginTop: "4px",
                        borderRadius: "6px",
                        border: "1px solid #aaa",
                        fontSize: 14,
                    }}
                >
                    {["A1", "In progress"].map((lvl) => (
                        <option key={lvl} value={lvl}>{lvl}</option>
                    ))}
                </select>
            </label>

            {/* Язык интерфейса */}
            <label style={{ fontSize: 14, fontWeight: 600 }}>
                {labels.language}
                <select
                    value={locale}
                    onChange={(e) => setLocale(e.target.value)}
                    style={{
                        width: "100%",
                        padding: "6px",
                        marginTop: "4px",
                        borderRadius: "6px",
                        border: "1px solid #aaa",
                        fontSize: 14,
                    }}
                >
                    <option value="ru">Русский</option>
                    <option value="en">English</option>
                </select>
            </label>
        </div>
    );
}