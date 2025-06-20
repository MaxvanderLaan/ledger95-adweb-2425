'use client'

import styles from '@/app/dashboard/dashboard.module.css';
import Link from 'next/link';
import Image from 'next/image';
import { useState, useEffect } from "react";
import { db } from '@/firebase';
import { collection, onSnapshot } from "firebase/firestore";
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
                            data.archived === true &&
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

    return (
        <div>
            <Link href="/dashboard/ledger">
                <div className={styles.folder}>
                    <div className={styles.box}>+</div>
                    <Image width={16} height={16} src="/icons/directory_open_file_mydocs-5.png" alt="directory_open_file_mydocs" />
                    <p>Ledger</p>
                </div>
            </Link>
            <Link href="/dashboard">
                <div className={styles.folder}>
                    <div className={styles.box}>-</div>
                    <Image width={16} height={16} src="/icons/directory_open_file_mydocs-5.png" alt="directory_open_file_mydocs" />
                    <p>Archive</p>
                </div>
            </Link>
            <div className={styles.secondLevel}>
                {ledgers.map((ledger) => (
                    <div key={ledger.id} className={styles.folder}>
                        <Image width={16} height={16} src="/icons/directory_closed_cool-3.png" alt="ledger icon" />
                        <p>{ledger.name}</p>
                    </div>
                ))}
            </div>
        </div>
    );
}