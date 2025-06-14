"use client";

import { createContext, useContext, useState, ReactNode } from 'react';

interface Ledger {
    id: string;
    name: string;
    description: string;
}

interface LedgerContextType {
    ledger: Ledger | null;
    setLedger: (ledger: Ledger | null) => void;
}

const LedgerContext = createContext<LedgerContextType | undefined>(undefined);

export const LedgerProvider = ({ children }: { children: ReactNode }) => {
    const [ledger, setLedger] = useState<Ledger | null>(null);

    return (
        <LedgerContext.Provider value={{ ledger, setLedger }}>
            {children}
        </LedgerContext.Provider>
    );
};

export const useLedger = () => {
    const context = useContext(LedgerContext);
    if (!context) {
        throw new Error('useLedger must be used within a LedgerProvider');
    }
    return context;
};
