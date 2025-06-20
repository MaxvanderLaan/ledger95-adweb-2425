'use client'

import styles from '@/app/dashboard/dashboard.module.css';
import Link from 'next/link';
import Image from 'next/image';
import { useState, useEffect } from "react";
import { db } from '@/firebase';
import { collection, onSnapshot } from "firebase/firestore";
import { useLedger } from '@/context/LedgerContext';
import { getAuth, onAuthStateChanged, User } from "firebase/auth";

interface Ledger {
    id: string;
    name: string;
    description: string;
    owner?: string;
    members?: Record<string, string>;
    archived?: boolean;
}

export default function Page() {
    const [ledgers, setLedgers] = useState<Ledger[]>([]);
    const { ledger, setLedger } = useLedger();
    const [user, setUser] = useState<User | null>(null);

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(getAuth(), (firebaseUser) => {
            setUser(firebaseUser);
        });
        return () => unsubscribe();
    }, []);

    useEffect(() => {
        if (!user) return;

        const unsubscribe = onSnapshot(collection(db, 'ledgers'), (snapshot) => {
            const fetchedLedgers: Ledger[] = snapshot.docs
                .filter(doc => {
                    const data = doc.data();
                    return (
                        data.archived !== true &&
                        (data.owner === user.uid || (data.members && user.uid in data.members))
                    );
                })
                .map(doc => ({
                    ...doc.data(),
                    id: doc.id,
                })) as Ledger[];

            setLedgers(fetchedLedgers);
        });

        return () => unsubscribe();
    }, [user]);

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
