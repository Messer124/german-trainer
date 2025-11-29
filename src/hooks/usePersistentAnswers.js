import { useState, useEffect } from "react";

export function usePersistentAnswers(storageKey, defaultValue) {
    const [answers, setAnswers] = useState(() => {
        if (typeof window === "undefined") {
            return defaultValue;
        }

        try {
            const saved = window.localStorage.getItem(storageKey);
            return saved ? JSON.parse(saved) : defaultValue;
        } catch {
            return defaultValue;
        }
    });

    // Сохранение в localStorage при каждом изменении
    useEffect(() => {
        if (typeof window === "undefined") return;

        try {
            window.localStorage.setItem(storageKey, JSON.stringify(answers));
        } catch {
            // можно залогировать в будущем
        }
    }, [storageKey, answers]);

    // Подписка на глобальное событие очистки для этого ключа
    useEffect(() => {
        const eventName = `clear-${storageKey}`;

        const handleClear = () => {
            setAnswers(defaultValue);

            if (typeof window !== "undefined") {
                try {
                    window.localStorage.removeItem(storageKey);
                } catch {
                    // можно залогировать в будущем
                }
            }
        };

        window.addEventListener(eventName, handleClear);
        return () => {
            window.removeEventListener(eventName, handleClear);
        };
    }, [storageKey, defaultValue]);

    return [answers, setAnswers];
}