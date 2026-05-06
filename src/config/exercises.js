export const DEFAULT_LEVEL = "A1.1";

const LEVEL_LOADERS = {
    "A1.1": () => import("./levels/a1-1"),
    "A1.2": () => import("./levels/a1-2"),
    A2: () => import("./levels/a2"),
    B1: () => import("./levels/b1"),
};

const levelCache = new Map();

export function getAvailableLevels() {
    return Object.keys(LEVEL_LOADERS);
}

export function resolveExerciseLevel(level) {
    return LEVEL_LOADERS[level] ? level : DEFAULT_LEVEL;
}

export function loadExercisesForLevel(level) {
    const resolvedLevel = resolveExerciseLevel(level);

    if (!levelCache.has(resolvedLevel)) {
        const promise = LEVEL_LOADERS[resolvedLevel]().then((module) => module.default);
        levelCache.set(resolvedLevel, promise);
    }

    return levelCache.get(resolvedLevel);
}
