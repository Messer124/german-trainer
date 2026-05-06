export function defineExercise(component, storageKey, options = {}) {
    return {
        storageKey,
        component,
        title: options.title ?? component.title,
        instructions: options.instructions ?? component.instructions,
        hasHint: options.hasHint ?? true,
    };
}
