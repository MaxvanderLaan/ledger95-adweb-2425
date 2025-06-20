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
    const [ledgers, setLedgers] = useState<Ledger[]>([]);
    const { ledger, setLedger } = useLedger();

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

    const handleSelectLedger = (clickedLedger: Ledger) => {
        if (ledger?.id === clickedLedger.id) {
            setLedger(null);
        } else {
            setLedger(clickedLedger);
        }
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
            {ledgers.map((item) => {
                const isActive = ledger?.id === item.id;
                return (
                    <div key={item.id} className={styles.folder} onClick={() => handleSelectLedger(item)} style={{ cursor: 'pointer' }}>
                        <div className={styles.box}>{isActive ? '-' : '+'}</div>
                        <Image width={16} height={16} src="/icons/directory_closed_cool-3.png" alt="ledger icon" />
                        <p>{item.name}</p>
                    </div>
                );
            })}

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
