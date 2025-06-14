'use client';

import { useState, useEffect } from "react";
import { db } from '@/firebase';
import { collection, getDocs, query, where } from "firebase/firestore";
import styles from '@/app/ledger/[ledgerId]/categories/category.module.css';
import CategoryRow from "@/app/ui/categoryRow";

interface Props {
    ledgerId: string;
    categories: {
        id: string;
        budget: string;
        name: string;
        experation: string;
    }[];
}

interface Transaction {
    id: string;
    amount: string;
    categoryId: string;
    date: Date;
}

export default function CategoryTable({ ledgerId, categories }: Props) {
    const [transactions, setTransactions] = useState<Transaction[]>([]);

    useEffect(() => {
        const fetchItems = async () => {
            const querySnapshot = await getDocs(query(collection(db, 'transactions'),
                where('ledgerId', '==', ledgerId), where('categoryId', '!=', '')));
            const fetchedTransactions: Transaction[] = querySnapshot.docs.map((doc) => {
                const data = doc.data();
                return {
                    ...data,
                    id: doc.id
                };
            }) as Transaction[];

            setTransactions(fetchedTransactions);
        };

        fetchItems();
    }, [ledgerId]);

    // Takes all the linked transactions to a category and calculates the sum of the amount.
    // Gets passed to CategoryRow for visualization.
    const calculateSpentByCategory = (categoryId: string): number => {
        const relevantTransactions = transactions.filter(
            (transaction) => transaction.categoryId === categoryId
        );

        const total = relevantTransactions.reduce((sum, transaction) => {
            return sum + (typeof transaction.amount === 'number' ? transaction.amount : 0);
        }, 0);

        return total;
    };

    return (
        <div className={styles.table}>
            {categories.map((category) => (
                <div key={category.id}>
                    <CategoryRow name={category.name}
                        budget={parseFloat(category.budget)}
                        spent={calculateSpentByCategory(category.id)}
                        ledgerId={ledgerId}
                        experation={category.experation}
                        id={category.id} />
                </div>
            ))}
        </div>
    );
}
