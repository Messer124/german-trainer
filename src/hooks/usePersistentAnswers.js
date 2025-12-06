import { useState, useEffect } from "react";

// реестр всех сторов по storageKey
const stores = new Map();

/**
 * Внутренний регистратор стора по ключу
 */
function registerStore(storageKey, resetFn) {
    stores.set(storageKey, resetFn);
}

function unregisterStore(storageKey, resetFn) {
    const existing = stores.get(storageKey);
    if (existing === resetFn) {
        stores.delete(storageKey);
    }
}

/**
 * Внешняя функция для очистки ответов по ключу.
 * Можно вызывать из App.jsx.
 */
export function clearAnswersByStorageKey(storageKey) {
    const reset = stores.get(storageKey);

    if (reset) {
        reset();
    }

    if (typeof window !== "undefined") {
        try {
            window.localStorage.removeItem(storageKey);
        } catch {
            // игнорируем ошибки localStorage
        }
    }
}

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

    // Регистрируем стор в реестре, чтобы можно было очищать напрямую
    useEffect(() => {
        const reset = () => setAnswers(defaultValue);

        registerStore(storageKey, reset);
        return () => unregisterStore(storageKey, reset);
    }, [storageKey, defaultValue]);

    // (опционально можно оставить старую логику через события,
    //  но она больше не обязательна)
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
