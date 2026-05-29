export function normalizeAnswer(value, options = {}) {
    const { stripFinalPunctuation = false } = options;
    let normalized = String(value ?? "")
        .trim()
        .toLowerCase()
        .replace(/[’`´]/g, "'")
        .replace(/\s+/g, " ");

    if (stripFinalPunctuation) {
        normalized = normalized.replace(/[.!?]+$/u, "");
    }

    return normalized;
}

export function isAcceptedAnswer(value, acceptedAnswers, options = {}) {
    const answers = Array.isArray(acceptedAnswers) ? acceptedAnswers : [acceptedAnswers];
    const normalizedValue = normalizeAnswer(value, options);

    return answers.some((answer) => normalizeAnswer(answer, options) === normalizedValue);
}
