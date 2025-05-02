'use client';

import styles from './monthly.module.css';
import { useState, useEffect } from "react";
import { db } from '@/firebase';
import { collection, getDocs, query, where } from "firebase/firestore";
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

    useEffect(() => {
        const fetchItems = async () => {
            // Server-side filtering with queries.
            const querySnapshot = await getDocs(query(collection(db, 'transactions'), where('ledgerId', '==', ledgerId)));
            const fetchedTransactions: Transaction[] = querySnapshot.docs.map((doc) => {
                const data = doc.data();
                return {
                    ...data,
                    id: doc.id,
                    date: data.date.toDate(),
                };
            }) as Transaction[];

            setTransactions(fetchedTransactions);
        };

        fetchItems();
    }, [ledgerId]);

    const groupedRows: Row[] = [];
    let lastMonth = '';

    const sortedTransactions = [...transactions].sort((a, b) => b.date.getTime() - a.date.getTime());

    // Takes the sorted list and checks for each date if the month changes, if so print a month row.
    // Pushes date rows and month rows onto the groupedRows.
    for (const transaction of sortedTransactions) {
        const monthLabel = format(transaction.date, 'MMMM yyyy');
        if (monthLabel !== lastMonth) {
            groupedRows.push({ type: 'month', label: monthLabel });
            lastMonth = monthLabel;
        }
        groupedRows.push({ type: 'transaction', transaction: transaction });
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
                                    <p className={`${styles.cell} ${styles.right}`}>{date.toLocaleDateString('en-GB')}</p>
                                </div>
                            );
                        }
                    })}
                </div>
            </div>
        </div>
    );
}
