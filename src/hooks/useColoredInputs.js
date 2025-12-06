// hooks/useColoredInputs.js
import { useEffect } from "react";

const INPUT_SELECTOR =
    "input.input, input.autosize-input, input.table-input";

const COLOR_CLASSES = [
    "color-orange",
    "color-yellow",
    "color-violet",
    "color-green",
    "color-teal",
];

function applyRandomColorIfEmpty(input) {
    if (!(input instanceof HTMLInputElement)) return;

    const value = input.value.trim();
    const hasState =
        input.classList.contains("correct") ||
        input.classList.contains("incorrect");

    // сбрасываем прошлые цвета
    input.classList.remove("empty", ...COLOR_CLASSES);

    // если есть значение или уже проставлен correct/incorrect — не считаем пустым
    if (value !== "" || hasState) return;

    input.classList.add("empty");

    const color =
        COLOR_CLASSES[Math.floor(Math.random() * COLOR_CLASSES.length)];
    input.classList.add(color);
}

function applyForAllInputs() {
    const inputs = document.querySelectorAll(INPUT_SELECTOR);
    inputs.forEach((node) => applyRandomColorIfEmpty(node));
}

export function useColoredInputs() {
    useEffect(() => {
        if (typeof window === "undefined") return;

        const handleInput = (event) => {
            const target = event.target;
            if (!target || !target.matches(INPUT_SELECTOR)) return;
            applyRandomColorIfEmpty(target);
        };

        document.addEventListener("input", handleInput);
        document.addEventListener("change", handleInput);

        // первый проход по уже существующим инпутам
        applyForAllInputs();

        // следим за появлением новых инпутов (мобилка, смена упражнения и т.п.)
        let observer;
        if ("MutationObserver" in window) {
            observer = new MutationObserver((mutations) => {
                for (const mutation of mutations) {
                    mutation.addedNodes.forEach((node) => {
                        if (!(node instanceof HTMLElement)) return;

                        // сам узел — инпут
                        if (node.matches && node.matches(INPUT_SELECTOR)) {
                            applyRandomColorIfEmpty(node);
                        }

                        // или внутри него появились инпуты
                        if (node.querySelectorAll) {
                            node
                                .querySelectorAll(INPUT_SELECTOR)
                                .forEach((el) => applyRandomColorIfEmpty(el));
                        }
                    });
                }
            });

            observer.observe(document.body, {
                childList: true,
                subtree: true,
            });
        }

        return () => {
            document.removeEventListener("input", handleInput);
            document.removeEventListener("change", handleInput);
            if (observer) observer.disconnect();
        };
    }, []);
}
