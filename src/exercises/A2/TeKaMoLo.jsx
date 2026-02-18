import { useEffect, useMemo, useState } from "react";
import { DndContext, closestCenter, KeyboardSensor, MouseSensor, TouchSensor, useSensor, useSensors } from "@dnd-kit/core";
import { SortableContext, sortableKeyboardCoordinates, useSortable, arrayMove, rectSortingStrategy } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import ModalHtml from "../../components/ModalHtml";
import { useLocale } from "../../contexts/LocaleContext";
import { usePersistentAnswers } from "../../hooks/usePersistentAnswers";

import data from "../../../data/A2/tekamolo.json";
import hintRu from "../../../data/A2/images/tekamolo.html?raw";
import hintEn from "../../../data/A2/images/en/tekamolo.html?raw";

import "../../css/exercises/Common.css";
import "../../css/exercises/TeKaMoLo.css";

const STORAGE_KEY = "tekamolo-answers";
const COLOR_CLASSES = ["color-orange", "color-yellow", "color-violet", "color-green", "color-teal"];

function normalizeItems(rawItems) {
    if (Array.isArray(rawItems) && rawItems.length > 0 && Array.isArray(rawItems[0])) {
        return rawItems.flat();
    }
    return Array.isArray(rawItems) ? rawItems : [];
}

function normalize(value) {
    return String(value ?? "")
        .trim()
        .toLowerCase()
        .replace(/\s+/g, " ");
}

function SortableWord({ id, text, colorClass, isCorrect }) {
    const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id });
    const stableTransform = transform
        ? { ...transform, scaleX: 1, scaleY: 1 }
        : null;
    const style = {
        transform: CSS.Transform.toString(stableTransform),
        transition,
    };

    return (
        <button
            ref={setNodeRef}
            style={style}
            type="button"
            className={`tkm-word ${colorClass} ${isCorrect ? "tkm-word--correct" : ""} ${isDragging ? "tkm-word--dragging" : ""}`}
            {...attributes}
            {...listeners}
        >
            {text}
        </button>
    );
}

export default function TeKaMoLo() {
    const { locale } = useLocale();
    const [answers, setAnswers] = usePersistentAnswers(STORAGE_KEY, {});
    const [showHint, setShowHint] = useState(false);
    const hint = locale === "en" ? hintEn : hintRu;

    const sensors = useSensors(
        useSensor(MouseSensor, {
            activationConstraint: { distance: 8 },
        }),
        useSensor(TouchSensor, {
            activationConstraint: { tolerance: 10 },
        }),
        useSensor(KeyboardSensor, {
            coordinateGetter: sortableKeyboardCoordinates,
        })
    );

    const items = useMemo(
        () =>
            normalizeItems(data.items).map((item, itemIdx) => {
                const wordsSet = Array.isArray(item.wordsSet) ? item.wordsSet : [];
                const correctOrder = Array.isArray(item.correctOrder) ? item.correctOrder : [];

                const tokens = wordsSet.map((word, tokenIdx) => ({
                    id: `${itemIdx}-${tokenIdx}`,
                    word: String(word),
                }));

                const tokenMap = Object.fromEntries(tokens.map((token) => [token.id, token.word]));
                const tokenColorMap = Object.fromEntries(
                    tokens.map((token) => [
                        token.id,
                        COLOR_CLASSES[Math.floor(Math.random() * COLOR_CLASSES.length)],
                    ])
                );
                const defaultOrder = tokens.map((token) => token.id);
                const correctNormalized = correctOrder.map(normalize);

                return {
                    tokenMap,
                    tokenColorMap,
                    defaultOrder,
                    correctNormalized,
                };
            }),
        []
    );

    useEffect(() => {
        const handleShowHint = () => setShowHint(true);
        document.addEventListener("show-hint", handleShowHint);
        return () => document.removeEventListener("show-hint", handleShowHint);
    }, []);

    const getCurrentOrder = (itemIdx) => {
        const stored = answers[itemIdx]?.order;
        const defaultOrder = items[itemIdx]?.defaultOrder ?? [];

        if (!Array.isArray(stored) || stored.length !== defaultOrder.length) {
            return defaultOrder;
        }

        const storedSet = new Set(stored);
        if (storedSet.size !== defaultOrder.length) return defaultOrder;
        for (const id of defaultOrder) {
            if (!storedSet.has(id)) return defaultOrder;
        }
        return stored;
    };

    const getIsCorrect = (order, itemIdx) => {
        const tokenMap = items[itemIdx]?.tokenMap ?? {};
        const actualNormalized = order.map((id) => normalize(tokenMap[id]));
        const expected = items[itemIdx]?.correctNormalized ?? [];

        if (actualNormalized.length !== expected.length) return false;
        return actualNormalized.every((word, idx) => word === expected[idx]);
    };

    const handleDragEnd = (itemIdx, event) => {
        const { active, over } = event;
        if (!over || active.id === over.id) return;

        const currentOrder = getCurrentOrder(itemIdx);
        const oldIndex = currentOrder.indexOf(active.id);
        const newIndex = currentOrder.indexOf(over.id);
        if (oldIndex === -1 || newIndex === -1) return;

        const nextOrder = arrayMove(currentOrder, oldIndex, newIndex);
        const isCorrect = getIsCorrect(nextOrder, itemIdx);

        setAnswers((prev) => ({
            ...prev,
            [itemIdx]: {
                order: nextOrder,
                isCorrect,
            },
        }));
    };

    const handleDragOver = (itemIdx, event) => {
        const { active, over } = event;
        if (!over || active.id === over.id) return;

        const currentOrder = getCurrentOrder(itemIdx);
        const oldIndex = currentOrder.indexOf(active.id);
        const newIndex = currentOrder.indexOf(over.id);
        if (oldIndex === -1 || newIndex === -1) return;

        const nextOrder = arrayMove(currentOrder, oldIndex, newIndex);
        const isCorrect = getIsCorrect(nextOrder, itemIdx);

        setAnswers((prev) => ({
            ...prev,
            [itemIdx]: {
                order: nextOrder,
                isCorrect,
            },
        }));
    };

    return (
        <div className="exercise-inner">
            {showHint && <ModalHtml html={hint} onClose={() => setShowHint(false)} />}

            <div className="scroll-container">
                <ul className="list tkm-exercise-list">
                    {items.map((item, itemIdx) => {
                        const order = getCurrentOrder(itemIdx);
                        const isSentenceCorrect = Boolean(answers[itemIdx]?.isCorrect);

                        return (
                            <li key={itemIdx} className="tkm-card">
                                <DndContext
                                    sensors={sensors}
                                    collisionDetection={closestCenter}
                                    onDragOver={(event) => handleDragOver(itemIdx, event)}
                                    onDragEnd={(event) => handleDragEnd(itemIdx, event)}
                                >
                                    <SortableContext items={order} strategy={rectSortingStrategy}>
                                        <div className="tkm-words-wrap">
                                            {order.map((id) => {
                                                const word = item.tokenMap[id];

                                                return (
                                                    <SortableWord
                                                        key={id}
                                                        id={id}
                                                        text={word}
                                                        colorClass={item.tokenColorMap[id]}
                                                        isCorrect={isSentenceCorrect}
                                                    />
                                                );
                                            })}
                                        </div>
                                    </SortableContext>
                                </DndContext>
                            </li>
                        );
                    })}
                </ul>
            </div>
        </div>
    );
}

TeKaMoLo.headerButton = (
    <button
        type="button"
        className="hint-button"
        onClick={() => document.dispatchEvent(new CustomEvent("show-hint"))}
    >
        !
    </button>
);

TeKaMoLo.instructions = data.instructions;
TeKaMoLo.title = { ru: "TeKaMoLo", en: "TeKaMoLo" };
