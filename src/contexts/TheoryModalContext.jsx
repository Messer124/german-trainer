import { createContext, useContext } from "react";

const TheoryModalContext = createContext({
    isTheoryOpen: false,
    openTheory: () => {},
    closeTheory: () => {},
});

export function TheoryModalProvider({ children, isTheoryOpen, openTheory, closeTheory }) {
    return (
        <TheoryModalContext.Provider value={{ isTheoryOpen, openTheory, closeTheory }}>
            {children}
        </TheoryModalContext.Provider>
    );
}

export function useTheoryModal() {
    return useContext(TheoryModalContext);
}
