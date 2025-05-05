'use client'

import { useParams } from 'next/navigation';
import { useState, useEffect } from "react";
import { db } from '@/firebase';
import { doc, getDoc } from "firebase/firestore";

interface Ledger {
    id: string;
    name: string;
    description: string;
}

export default function Page() {
    const [ledger, setLedger] = useState<Ledger | null>(null);

    const params = useParams();
    const ledgerId = params.ledgerId as string;

    useEffect(() => {
        const fetchLedger = async () => {

            const docRef = doc(db, 'ledgers', ledgerId);
            const docSnap = await getDoc(docRef);

            if (docSnap.exists()) {
                const data = docSnap.data();
                setLedger({
                    id: docSnap.id,
                    name: data.name,
                    description: data.description
                });
            } else {
                console.warn("No such document!");
                setLedger(null);
            }
        };

        fetchLedger();
    }, [ledgerId]);


    return (
        <main>
            {ledger ? (
                <div>
                    <p>{ledger.description}</p>
                </div>
            ) : (
                <p>Loading or not found...</p>
            )}
        </main>
    );
}
