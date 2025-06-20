'use client';

import { useState, useEffect } from "react";
import { db } from '@/firebase';
import { collection, query, where, Timestamp, onSnapshot } from "firebase/firestore";
import styles from '@/app/ledger/[ledgerId]/categories/category.module.css';
import CategoryRow from "@/app/ui/categoryRow";

interface Props {
    ledgerId: string;
    categories: {
        id: string;
        budget: string;
        name: string;
        expiration: Timestamp;
    }[];
}

interface Transaction {
    id: string;
    amount: string;
    categoryId: string;
    date: Timestamp;
}

export default function CategoryTable({ ledgerId, categories }: Props) {
    const [transactions, setTransactions] = useState<Transaction[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (!ledgerId) {
            setLoading(false);
            return;
        }

        setLoading(true);
        setError(null);

        try {
            const q = query(
                collection(db, 'transactions'),
                where('ledgerId', '==', ledgerId),
                where('categoryId', '!=', '')
            );

            const unsubscribe = onSnapshot(
                q,
                (querySnapshot) => {
                    try {
                        const fetchedTransactions: Transaction[] = querySnapshot.docs.map((doc) => {
                            const data = doc.data();
                            return {
                                ...data,
                                id: doc.id
                            };
                        }) as Transaction[];

                        setTransactions(fetchedTransactions);
                        setLoading(false);
                    } catch (err) {
                        setError('Error processing transactions');
                        setLoading(false);
                        console.error('Error processing transactions:', err);
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
            setError('Failed to set up transactions listener');
            setLoading(false);
            console.error('Failed to set up transactions listener:', err);
        }
    }, [ledgerId]);

    const calculateSpentByCategory = (categoryId: string): number => {
        if (loading) return 0;

        const relevantTransactions = transactions.filter(
            (transaction) => transaction.categoryId === categoryId
        );

        const total = relevantTransactions.reduce((sum, transaction) => {
            try {
                let numericAmount: number;

                if (typeof transaction.amount === 'string') {
                    const cleanedAmount = transaction.amount.replace(/[^0-9.-]+/g, "");
                    numericAmount = parseFloat(cleanedAmount);
                } else if (typeof transaction.amount === 'number') {
                    numericAmount = transaction.amount;
                } else {
                    numericAmount = 0;
                }

                if (isNaN(numericAmount)) {
                    console.warn(`Invalid amount format for transaction ${transaction.id}: ${transaction.amount}`);
                    return sum;
                }

                return sum + numericAmount;
            } catch (err) {
                console.error(`Error processing amount for transaction ${transaction.id}:`, err);
                return sum;
            }
        }, 0);

        return total;
    };

    if (loading) {
        return <div className={`${styles.table} loadingMessage`}>Loading transactions...</div>;
    }

    if (error) {
        return <div className={`${styles.table} errorMessage`}>Error: {error}</div>;
    }

    if (categories.length === 0) {
        return <div className={`${styles.table} emptyMessage`}>No categories found.</div>;
    }

    return (
        <div className={styles.table}>
            {categories.map((category) => (
                <div key={category.id}>
                    <CategoryRow
                        name={category.name}
                        budget={parseFloat(category.budget)}
                        spent={calculateSpentByCategory(category.id)}
                        ledgerId={ledgerId}
                        expiration={category.expiration}
                        id={category.id}
                    />
                </div>
            ))}
        </div>
    );
}
