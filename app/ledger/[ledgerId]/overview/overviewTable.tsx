'use client';

import styles from './overview.module.css';
import { useState, useEffect } from "react";
import { db } from '@/firebase';
import { collection, getDocs, query, where, deleteDoc, doc } from "firebase/firestore";
import Link from 'next/link';

interface Props {
    ledgerId: string;
}

interface Transaction {
    id: string;
    amount: string;
    category: string;
    date: Date;
}

export default function OverviewTable({ ledgerId }: Props) {
    const [transactions, setTransactions] = useState<Transaction[]>([]);

    useEffect(() => {
        const fetchItems = async () => {
            const querySnapshot = await getDocs(
                query(collection(db, 'transactions'), where('ledgerId', '==', ledgerId))
            );
            const fetchedTransactions: Transaction[] = querySnapshot.docs.map((docSnap) => {
                const data = docSnap.data();
                return {
                    ...data,
                    id: docSnap.id,
                    date: data.date.toDate(),
                };
            }) as Transaction[];

            setTransactions(fetchedTransactions);
        };

        fetchItems();
    }, [ledgerId]);

    return (
        <div className={styles.overview}>
            <div className={styles.table}>
                <div className={styles.headers}>
                    <p className={`${styles.label} ${styles.left}`}>Amount</p>
                    <p className={`${styles.label} ${styles.middle}`}>Category</p>
                    <p className={`${styles.label} ${styles.right}`}>Date</p>
                    <p className={`${styles.label} ${styles.delete}`}>Actions</p>
                </div>
                <div className={styles.content}>
                    {transactions.map((transaction) => (
                        <div key={transaction.id} className={styles.row}>
                            <p className={`${styles.cell} ${styles.left}`}>{transaction.amount}</p>
                            <p className={`${styles.cell} ${styles.middle}`}>{transaction.category}</p>
                            <p className={`${styles.cell} ${styles.right}`}>
                                {transaction.date.toLocaleDateString('en-GB')}
                            </p>
                            <div className={`${styles.cell} ${styles.delete}`} style={{ display: 'flex', gap: '8px' }}>
                            <Link href={`/ledger/${ledgerId}/edit/${transaction.id}`}>
                                <button>Edit</button>
                            </Link>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
