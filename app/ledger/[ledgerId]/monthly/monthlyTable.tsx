'use client';

import styles from './monthly.module.css';
import { useState, useEffect } from "react";
import { db } from '@/firebase';
import { collection, query, where, onSnapshot, Timestamp } from "firebase/firestore";
import { format } from 'date-fns';

interface Props {
    ledgerId: string;
}

interface Transaction {
    id: string;
    amount: string;
    category: string;
    date: Date;
}

interface Row {
    type: 'month' | 'transaction';
    label?: string;
    transaction?: Transaction;
}

export default function MonthlyTable({ ledgerId }: Props) {
    const [transactions, setTransactions] = useState<Transaction[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (!ledgerId) return;

        setLoading(true);
        setError(null);

        try {
            const q = query(collection(db, 'transactions'), where('ledgerId', '==', ledgerId));
            const unsubscribe = onSnapshot(q,
                (querySnapshot) => {
                    try {
                        const fetchedTransactions: Transaction[] = querySnapshot.docs.map((doc) => {
                            const data = doc.data();
                            let date = new Date();

                            if (data.date) {
                                if (data.date instanceof Timestamp) {
                                    date = data.date.toDate();
                                } else if (data.date.seconds) {
                                    date = new Date(data.date.seconds * 1000);
                                } else if (typeof data.date === 'object' && data.date.toDate) {
                                    date = data.date.toDate();
                                } else if (typeof data.date === 'string') {
                                    date = new Date(data.date);
                                } else if (typeof data.date === 'number') {
                                    date = new Date(data.date);
                                }
                            }

                            return {
                                ...data,
                                id: doc.id,
                                date: date,
                            };
                        }) as Transaction[];

                        setTransactions(fetchedTransactions);
                        setLoading(false);
                    } catch (err) {
                        setError('Error processing transaction data');
                        setLoading(false);
                        console.error('Error processing transaction data:', err);
                    }
                },
                (err) => {
                    setError('Error fetching transactions');
                    setLoading(false);
                    console.error('Error fetching transactions:', err);
                }
            );

            return () => unsubscribe();
        } catch (err) {
            setError('Error setting up transaction listener');
            setLoading(false);
            console.error('Error setting up transaction listener:', err);
        }
    }, [ledgerId]);

    const groupedRows: Row[] = [];
    let lastMonth = '';

    const sortedTransactions = [...transactions].sort((a, b) => b.date.getTime() - a.date.getTime());

    for (const transaction of sortedTransactions) {
        try {
            const monthLabel = format(transaction.date, 'MMMM yyyy');
            if (monthLabel !== lastMonth) {
                groupedRows.push({ type: 'month', label: monthLabel });
                lastMonth = monthLabel;
            }
            groupedRows.push({ type: 'transaction', transaction: transaction });
        } catch (err) {
            console.error('Error processing transaction:', transaction.id, err);
            continue;
        }
    }

    if (loading) {
        return <div className={styles.monthly}>Loading transactions...</div>;
    }

    if (error) {
        return <div className={styles.monthly}>Error: {error}</div>;
    }

    if (groupedRows.length === 0) {
        return <div className={styles.monthly}>No transactions found.</div>;
    }

    return (
        <div className={styles.monthly}>
            <div className={styles.table}>
                <div className={styles.headers}>
                    <p className={`${styles.label} ${styles.left}`}>Amount</p>
                    <p className={`${styles.label} ${styles.middle}`}>Category</p>
                    <p className={`${styles.label} ${styles.right}`}>Date</p>
                </div>
                <div className={styles.content}>
                    {groupedRows.map((row, index) => {
                        if (row.type === 'month') {
                            return (
                                <div key={`month-${index}`} className={`${styles.row} ${styles.month}`}>
                                    -- {row.label} --
                                </div>
                            );
                        } else if (row.transaction) {
                            const { id, amount, category, date } = row.transaction;
                            return (
                                <div key={id} className={styles.row}>
                                    <p className={`${styles.cell} ${styles.left}`}>{amount}</p>
                                    <p className={`${styles.cell} ${styles.middle}`}>{category}</p>
                                    <p className={`${styles.cell} ${styles.right}`}>{date.toLocaleDateString('en-US')}</p>
                                </div>
                            );
                        }
                        return null;
                    })}
                </div>
            </div>
        </div>
    );
}
