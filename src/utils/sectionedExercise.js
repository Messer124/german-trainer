export function getLocalizedText(raw, locale) {
    if (typeof raw === "string") return raw;

    if (raw && typeof raw === "object") {
        return raw[locale] ?? raw.ru ?? raw.en ?? "";
    }

    return "";
}

function getLocalizedAnswer(raw, locale) {
    if (Array.isArray(raw)) {
        return raw.map((answer) => getLocalizedAnswer(answer, locale));
    }

    if (raw && typeof raw === "object") {
        return getLocalizedText(raw, locale);
    }

    return raw;
}

export function getAcceptedAnswers(item, locale) {
    const rawAnswers = Array.isArray(item?.answers)
        ? item.answers
        : Array.isArray(item?.answer)
            ? item.answer
            : [item?.answer];

    return rawAnswers
        .map((answer) => getLocalizedAnswer(answer, locale))
        .map((answer) => String(answer ?? "").trim())
        .filter(Boolean);
}

export function normalizeExerciseSections(rawData, locale, fallbackId = "section") {
    const rawSections = Array.isArray(rawData?.sections) ? rawData.sections : [];
    let sentenceIndex = 0;

    return rawSections
        .map((section, sectionIndex) => {
            const sectionId = `${fallbackId}-${sectionIndex}`;
            const sectionItems = Array.isArray(section.items) ? section.items : [];

            return {
                id: sectionId,
                type: section.type ?? "fill",
                key: `${fallbackId}-${sectionId}`,
                label: getLocalizedText(section.label, locale),
                items: sectionItems
                    .map((item, itemIndex) => {
                        const answers = getAcceptedAnswers(item, locale);
                        const localizedAnswer = getLocalizedAnswer(item.answer, locale);
                        const currentSentenceIndex = sentenceIndex;
                        sentenceIndex += 1;

                        return {
                            ...item,
                            key: `${sectionId}-${itemIndex}`,
                            answerKey: `${sectionId}-${itemIndex}`,
                            section: sectionId,
                            sectionId,
                            sectionType: section.type ?? "fill",
                            sectionIndex,
                            itemIndex,
                            sentenceIndex: currentSentenceIndex,
                            sentence: getLocalizedText(item.sentence, locale),
                            placeholder: getLocalizedText(item.placeholder, locale),
                            translation: getLocalizedText(item.translation, locale),
                            answer: localizedAnswer,
                            answers,
                        };
                    })
                    .filter((item) => item.sentence && item.answers.length > 0),
            };
        })
        .filter((section) => section.items.length > 0);
}
