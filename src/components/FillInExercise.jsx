import { useMemo } from "react";
import ExpandingInput from "./ExpandingInput";
import ModalHtml from "./ModalHtml";
import ProgressiveList from "./ProgressiveList";
import SectionedProgressiveList from "./SectionedProgressiveList";
import { useLocale } from "../contexts/LocaleContext";
import { useTheoryModal } from "../contexts/TheoryModalContext";
import { usePersistentAnswers } from "../hooks/usePersistentAnswers";
import { isAcceptedAnswer } from "../utils/answerUtils";
import {
    getAcceptedAnswers,
    getLocalizedText,
    normalizeExerciseSections,
} from "../utils/sectionedExercise";

import "../css/exercises/Common.css";

const DEFAULT_BLANK_PATTERN = /_{3,}/;

const DEFAULT_INPUT_SIZES = {
    full: {
        minWidth: 300,
        mobileMinWidth: 140,
        tabletMinWidth: 210,
        maxWidth: 820,
    },
    blank: {
        minWidth: 95,
        mobileMinWidth: 65,
        tabletMinWidth: 80,
        maxWidth: 240,
    },
};

function getInputClass(baseClassName, value, isCorrect) {
    if (String(value ?? "").trim() === "") return baseClassName;
    return `${baseClassName} ${isCorrect ? "correct" : "incorrect"}`;
}

function getInputSizes(inputSizes, mode) {
    return {
        ...DEFAULT_INPUT_SIZES[mode],
        ...(inputSizes?.[mode] ?? {}),
    };
}

function flattenItems(items) {
    if (!Array.isArray(items)) return [];
    if (items.length > 0 && Array.isArray(items[0])) return items.flat();
    if (items.length > 0 && items[0] && Array.isArray(items[0].items)) {
        return items.flatMap((group) => (Array.isArray(group.items) ? group.items : []));
    }
    return items;
}

function getAnswers(item, locale, answerField) {
    if (!answerField) return getAcceptedAnswers(item, locale);

    const rawAnswer = item?.[answerField];
    const rawAnswers = Array.isArray(rawAnswer) ? rawAnswer : [rawAnswer];

    return rawAnswers
        .map((answer) => getLocalizedText(answer, locale))
        .map((answer) => String(answer ?? "").trim())
        .filter(Boolean);
}

function getAnswersByBlank(item, locale) {
    if (!Array.isArray(item?.answers) || !item.answers.some(Array.isArray)) return null;

    return item.answers.map((rawAnswers) => {
        const answers = Array.isArray(rawAnswers) ? rawAnswers : [rawAnswers];

        return answers
            .map((answer) => getLocalizedText(answer, locale))
            .map((answer) => String(answer ?? "").trim())
            .filter(Boolean);
    });
}

function normalizeFlatItems(data, locale, fallbackId, sentenceField, answerField, placeholderField) {
    const rawItems = flattenItems(data?.items);

    return rawItems
        .map((item, itemIndex) => ({
            ...item,
            key: `${fallbackId}-${itemIndex}`,
            answerKey: item.answerKey ?? `${itemIndex}`,
            sentenceIndex: itemIndex,
            sentence: getLocalizedText(item[sentenceField], locale),
            placeholder: getLocalizedText(item[placeholderField], locale),
            answers: getAnswers(item, locale, answerField),
            answersByBlank: getAnswersByBlank(item, locale),
        }))
        .filter((item) => item.sentence && item.answers.length > 0);
}

export default function FillInExercise({
    data,
    storageKey,
    fallbackId,
    slidesByLocale,
    sectioned = Array.isArray(data?.sections),
    splitBlanks = true,
    multiBlank = false,
    blankPattern = DEFAULT_BLANK_PATTERN,
    inputPrefix = fallbackId,
    buildAnswerKey,
    inputClassName = "autosize-input",
    inputSizes,
    normalizeOptions,
    scrollContainer = !sectioned,
    delayedHint = false,
    sentenceField = "sentence",
    answerField,
    placeholderField = "placeholder",
    separator = " —",
    hintMode = "all",
    listItemClassName = "list-item",
    sentenceClassName = "sentence",
    ariaLabel = fallbackId,
}) {
    const { locale } = useLocale();
    const { isTheoryOpen, closeTheory } = useTheoryModal();
    const [answers, setAnswers] = usePersistentAnswers(storageKey, {});

    const slides = useMemo(
        () =>
            typeof slidesByLocale === "function"
                ? slidesByLocale(locale)
                : slidesByLocale?.[locale] ?? slidesByLocale?.ru ?? [],
        [locale, slidesByLocale]
    );

    const entries = useMemo(
        () =>
            sectioned
                ? normalizeExerciseSections(data, locale, fallbackId)
                : normalizeFlatItems(
                    data,
                    locale,
                    fallbackId,
                    sentenceField,
                    answerField,
                    placeholderField
                ),
        [answerField, data, fallbackId, locale, placeholderField, sectioned, sentenceField]
    );

    const saveAnswer = (key, value, acceptedAnswers) => {
        setAnswers((prev) => ({
            ...prev,
            [key]: {
                value,
                isCorrect: isAcceptedAnswer(value, acceptedAnswers, normalizeOptions),
            },
        }));
    };

    const renderInput = (row, mode = "full", blankIndex = null) => {
        const rowAnswerKey = row.answerKey ?? row.sentenceIndex;
        const key =
            typeof buildAnswerKey === "function"
                ? buildAnswerKey(row, blankIndex)
                : blankIndex === null
                    ? `${inputPrefix}-${rowAnswerKey}`
                    : `${row.sentenceIndex}-${blankIndex}`;
        const acceptedAnswers =
            blankIndex === null
                ? row.answers
                : row.answersByBlank?.[blankIndex] ?? [row.answers?.[blankIndex]];
        const hintValue =
            hintMode === "first"
                ? acceptedAnswers[0] ?? ""
                : acceptedAnswers.filter(Boolean).join(" / ");
        const value = answers[key]?.value ?? "";
        const isCorrect = answers[key]?.isCorrect;
        const sizes = getInputSizes(inputSizes, mode);

        return (
            <ExpandingInput
                type="text"
                className={getInputClass(inputClassName, value, isCorrect)}
                value={value}
                placeholder={row.placeholder}
                onChange={(event) => saveAnswer(key, event.target.value, acceptedAnswers)}
                minWidth={sizes.minWidth}
                mobileMinWidth={sizes.mobileMinWidth}
                tabletMinWidth={sizes.tabletMinWidth}
                maxWidth={sizes.maxWidth}
                aria-label={`${ariaLabel} answer ${rowAnswerKey}`}
                enableHint
                delayedHint={delayedHint}
                hintValue={hintValue}
            />
        );
    };

    const renderRow = (row) => {
        const parts = String(row.sentence ?? "").split(blankPattern);

        if ((splitBlanks || multiBlank) && parts.length > 1) {
            return (
                <li key={row.key} className={listItemClassName}>
                    {parts.map((part, partIndex) => (
                        <span key={partIndex}>
                            {part}
                            {partIndex < parts.length - 1
                                ? renderInput(row, "blank", multiBlank ? partIndex : null)
                                : null}
                        </span>
                    ))}
                </li>
            );
        }

        return (
            <li key={row.key} className={listItemClassName}>
                <span className={sentenceClassName}>{row.sentence}{separator}</span>
                {renderInput(row, "full")}
            </li>
        );
    };

    const list = sectioned ? (
        <SectionedProgressiveList sections={entries} className="list">
            {(row) => renderRow(row)}
        </SectionedProgressiveList>
    ) : (
        <ProgressiveList items={entries} className="list">
            {(row) => renderRow(row)}
        </ProgressiveList>
    );

    return (
        <div className="exercise-inner">
            {isTheoryOpen && slides.length > 0 && (
                <ModalHtml images={slides} initialIndex={0} onClose={closeTheory} />
            )}

            {scrollContainer ? <div className="scroll-container">{list}</div> : list}
        </div>
    );
}
