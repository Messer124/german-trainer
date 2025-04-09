import { useLevel } from "../contexts/LevelContext";
import { useLocale } from "../contexts/LocaleContext";
import translations from "../locales/locales";
import "../css/components/SidebarControls.css"

export default function SidebarControls() {
    const { level, setLevel } = useLevel();
    const { locale, setLocale } = useLocale();
    const labels = translations[locale].labels;

    return (
        <div className="sidebar-controls">
            {/* Уровень */}
            <label>
        <span className="icon">
          <svg width="20" height="20" viewBox="0 0 24 24" stroke="black" fill="none" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M22 10L12 4L2 10l10 6l10-6z" />
            <path d="M6 12v5c0 1.1 2.7 2 6 2s6-.9 6-2v-5" />
          </svg>
        </span>
                {labels.level}
            </label>
            <select value={level} onChange={(e) => setLevel(e.target.value)}>
                {["A1", "In progress"].map((lvl) => (
                    <option key={lvl} value={lvl}>{lvl}</option>
                ))}
            </select>

            {/* Язык */}
            <label>
        <span className="icon">
          <svg width="20" height="20" viewBox="0 0 24 24" stroke="black" fill="none" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="10" />
            <line x1="2" y1="12" x2="22" y2="12" />
            <path d="M12 2a15.3 15.3 0 0 1 0 20a15.3 15.3 0 0 1 0-20z" />
          </svg>
        </span>
                {labels.language}
            </label>
            <select value={locale} onChange={(e) => setLocale(e.target.value)}>
                <option value="ru">Русский</option>
                <option value="en">English</option>
            </select>
        </div>
    );
}








