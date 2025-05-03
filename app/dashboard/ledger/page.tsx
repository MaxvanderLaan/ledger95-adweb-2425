'use client'

import styles from '@/app/dashboard/dashboard.module.css';
import Link from 'next/link';
import Image from 'next/image';
import { useState, useEffect } from "react";
import { db } from '@/firebase';
import { collection, getDocs } from "firebase/firestore";
import { useLedger } from '@/context/LedgerContext';

interface Ledger {
    id: string;
    name: string;
    description: string;
}

export default function Page() {
    const [ledgers, setLedgers] = useState<Ledger[]>([]);   //variable holding Ledgers from db
    const { setLedger } = useLedger(); //variable holding selected ledger for display in layout.tsx

    useEffect(() => {
        const fetchItems = async () => {
            const querySnapshot = await getDocs(collection(db, 'ledgers'));

            const fetchedLedgers: Ledger[] = querySnapshot.docs
                .filter(doc => doc.data().archived !== true)
                .map(doc => ({
                    ...doc.data(),
                    id: doc.id,
                })) as Ledger[];
            setLedgers(fetchedLedgers);
        };
        fetchItems();
    }, []);

    const handleSelectLedger = (ledger: Ledger) => {
        setLedger(ledger);
    };

    return (
        <div>
            <Link href="/dashboard">
                <div className={styles.folder}>
                    <div className={styles.box}>-</div>
                    <Image width={16} height={16} src="/icons/directory_open_file_mydocs-5.png" alt="directory_open_file_mydocs" />
                    <p>Ledger</p>
                </div>
            </Link>
            <div className={styles.secondLevel}>
                {ledgers.map((ledger) => (
                    <div key={ledger.id} className={styles.folder} onClick={() => handleSelectLedger(ledger)}>
                        <div className={styles.box}>+</div>
                        <Image width={16} height={16} src="/icons/directory_closed_cool-3.png" alt="ledger icon" />
                        <p>{ledger.name}</p>
                    </div>
                ))}
            </div>
            <Link href="/dashboard/archive">
            <div className={styles.folder}>
                <div className={styles.box}>+</div>
                <Image width={16} height={16} src="/icons/directory_open_file_mydocs-5.png" alt="directory_open_file_mydocs" />
                <p>Archive</p>
            </div>
            </Link>
        </div>
    );
}
