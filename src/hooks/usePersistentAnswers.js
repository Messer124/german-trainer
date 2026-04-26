import { useState, useEffect, useCallback, useRef } from "react";

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
    const answersRef = useRef(answers);

    useEffect(() => {
        answersRef.current = answers;
    }, [answers]);

    const saveAnswers = useCallback(() => {
        if (typeof window === "undefined") return;

        try {
            window.localStorage.setItem(storageKey, JSON.stringify(answersRef.current));
        } catch {
            // ответы остаются в памяти даже если localStorage временно недоступен
        }
    }, [storageKey]);

    // localStorage синхронный, поэтому сохраняем ответы на blur, а не на каждую букву.
    useEffect(() => {
        if (typeof document === "undefined" || typeof window === "undefined") {
            return undefined;
        }

        const handleVisibilityChange = () => {
            if (document.visibilityState === "hidden") {
                saveAnswers();
            }
        };

        document.addEventListener("focusout", saveAnswers);
        document.addEventListener("visibilitychange", handleVisibilityChange);
        window.addEventListener("pagehide", saveAnswers);

        return () => {
            document.removeEventListener("focusout", saveAnswers);
            document.removeEventListener("visibilitychange", handleVisibilityChange);
            window.removeEventListener("pagehide", saveAnswers);
        };
    }, [saveAnswers]);

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
