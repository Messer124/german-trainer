import { useEffect, useMemo, useRef, useState } from "react";
import { DndContext, DragOverlay, closestCenter, KeyboardSensor, MouseSensor, TouchSensor, useSensor, useSensors } from "@dnd-kit/core";
import { SortableContext, sortableKeyboardCoordinates, useSortable, arrayMove, rectSortingStrategy } from "@dnd-kit/sortable";
import { motion } from "framer-motion";
import ModalHtml from "../../components/ModalHtml";
import { useLocale } from "../../contexts/LocaleContext";
import { usePersistentAnswers } from "../../hooks/usePersistentAnswers";

import data from "../../../data/A2/tekamolo.json";
import hintRu from "../../../data/A2/images/tekamolo.html?raw";
import hintEn from "../../../data/A2/images/en/teKaMoLo.html?raw";

import "../../css/exercises/Common.css";
import "../../css/exercises/TeKaMoLo.css";

const STORAGE_KEY = "tekamolo-answers";
const COLOR_CLASSES = ["color-orange", "color-yellow", "color-violet", "color-green", "color-teal"];
const DRAG_INSERT_DELAY_MS = 200;

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

function SortableWord({ id, text, colorClass, isCorrect, activeDragId, isDraggingSession }) {
    const { attributes, listeners, setNodeRef, isDragging } = useSortable({
        id,
        transition: null,
    });
    const isActiveDragItem = isDraggingSession && activeDragId === id;

    return (
        <motion.button
            ref={setNodeRef}
            type="button"
            className={`tkm-word ${colorClass} ${isCorrect ? "tkm-word--correct" : ""} ${isDragging ? "tkm-word--dragging" : ""}`}
            layout
            transition={{
                type: "spring",
                stiffness: 560,
                damping: 38,
                mass: 0.7,
            }}
            style={{ opacity: isActiveDragItem ? 0 : 1 }}
            {...attributes}
            {...listeners}
        >
            {text}
        </motion.button>
    );
}

export default function TeKaMoLo() {
    const { locale } = useLocale();
    const [answers, setAnswers] = usePersistentAnswers(STORAGE_KEY, {});
    const [showHint, setShowHint] = useState(false);
    const [activeDragId, setActiveDragId] = useState(null);
    const [isDraggingSession, setIsDraggingSession] = useState(false);
    const pendingReorderRef = useRef({ timeoutId: null, signature: "" });
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

    const getCurrentOrder = (itemIdx, sourceAnswers = answers) => {
        const stored = sourceAnswers[itemIdx]?.order;
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

    const clearPendingReorder = () => {
        if (pendingReorderRef.current.timeoutId) {
            clearTimeout(pendingReorderRef.current.timeoutId);
        }
        pendingReorderRef.current = { timeoutId: null, signature: "" };
    };

    useEffect(() => clearPendingReorder, []);

    useEffect(() => {
        const resetDragState = () => {
            clearPendingReorder();
            setActiveDragId(null);
            setIsDraggingSession(false);
        };

        const handleVisibility = () => {
            if (document.hidden) resetDragState();
        };

        window.addEventListener("pointerup", resetDragState);
        window.addEventListener("touchend", resetDragState);
        window.addEventListener("touchcancel", resetDragState);
        window.addEventListener("blur", resetDragState);
        document.addEventListener("visibilitychange", handleVisibility);

        return () => {
            window.removeEventListener("pointerup", resetDragState);
            window.removeEventListener("touchend", resetDragState);
            window.removeEventListener("touchcancel", resetDragState);
            window.removeEventListener("blur", resetDragState);
            document.removeEventListener("visibilitychange", handleVisibility);
        };
    }, []);

    const applyReorder = (itemIdx, activeId, overId) => {
        if (!overId || activeId === overId) return;

        setAnswers((prev) => {
            const currentOrder = getCurrentOrder(itemIdx, prev);
            const oldIndex = currentOrder.indexOf(activeId);
            const newIndex = currentOrder.indexOf(overId);
            if (oldIndex === -1 || newIndex === -1 || oldIndex === newIndex) return prev;

            const nextOrder = arrayMove(currentOrder, oldIndex, newIndex);
            const isCorrect = getIsCorrect(nextOrder, itemIdx);
            return {
                ...prev,
                [itemIdx]: {
                    order: nextOrder,
                    isCorrect,
                },
            };
        });
    };

    const scheduleReorder = (itemIdx, activeId, overId) => {
        if (!overId || activeId === overId) return;
        const signature = `${itemIdx}:${activeId}->${overId}`;
        if (pendingReorderRef.current.signature === signature) return;

        clearPendingReorder();
        pendingReorderRef.current = {
            timeoutId: setTimeout(() => {
                applyReorder(itemIdx, activeId, overId);
                pendingReorderRef.current = { timeoutId: null, signature: "" };
            }, DRAG_INSERT_DELAY_MS),
            signature,
        };
    };

    const handleDragStart = (event) => {
        clearPendingReorder();
        setIsDraggingSession(true);
        setActiveDragId(String(event.active.id));
    };

    const handleDragOver = (itemIdx, event) => {
        const { active, over } = event;
        if (!over || active.id === over.id) return;
        scheduleReorder(itemIdx, String(active.id), String(over.id));
    };

    const handleDragEnd = (itemIdx, event) => {
        const { active, over } = event;
        setIsDraggingSession(false);
        setActiveDragId(null);
        if (!over || active.id === over.id) {
            clearPendingReorder();
            return;
        }

        const activeId = String(active.id);
        const overId = String(over.id);
        scheduleReorder(itemIdx, activeId, overId);
    };

    const handleDragCancel = () => {
        setIsDraggingSession(false);
        setActiveDragId(null);
        clearPendingReorder();
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
                                    onDragStart={handleDragStart}
                                    onDragOver={(event) => handleDragOver(itemIdx, event)}
                                    onDragEnd={(event) => handleDragEnd(itemIdx, event)}
                                    onDragCancel={handleDragCancel}
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
                                                        activeDragId={activeDragId}
                                                        isDraggingSession={isDraggingSession}
                                                    />
                                                );
                                            })}
                                        </div>
                                    </SortableContext>
                                    <DragOverlay>
                                        {isDraggingSession && activeDragId && activeDragId.startsWith(`${itemIdx}-`) ? (
                                            <motion.span
                                                className={`tkm-word ${item.tokenColorMap[activeDragId] ?? ""}`}
                                                initial={{ scale: 1 }}
                                                animate={{ scale: 1 }}
                                                transition={{ duration: 0 }}
                                                style={{ pointerEvents: "none" }}
                                            >
                                                {item.tokenMap[activeDragId]}
                                            </motion.span>
                                        ) : null}
                                    </DragOverlay>
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
