'use client';

import { useState, useEffect } from "react";
import { db } from '@/firebase';
import { collection, getDocs, query, where } from "firebase/firestore";
import styles from '@/app/ledger/[ledgerId]/categories/category.module.css';
import CategoryRow from "@/app/ui/categoryRow";

interface Props {
    ledgerId: string;
}

interface Categories {
    id: string;
    budget: string;
    name: string;
    experation: Date;
}

interface Transaction {
    id: string;
    amount: string;
    category: string;
    date: Date;
}

export default function CategoryTable({ ledgerId }: Props) {
    const [categories, setCategories] = useState<Categories[]>([]);
    
    useEffect(() => {
        const fetchItems = async () => {
            //server-side filtering with queries.
            const querySnapshot = await getDocs(query(collection(db, 'categories'), where('ledgerId', '==', ledgerId)));
            const fetchedTransactions: Categories[] = querySnapshot.docs.map((doc) => {
                const data = doc.data();
                return {
                    ...data,
                    id: doc.id,
                    //experation: data.experation.toDate(),
                };
            }) as Categories[];

            setCategories(fetchedTransactions);
        };

        fetchItems();
    }, [ledgerId]);

    return (
        <div className={styles.table}>
            {categories.map((category) => (
                <div key={category.id}>
                       <CategoryRow name={category.name} budget={parseFloat(category.budget)} spent={120} ledgerId={ledgerId}/>
                </div>
            ))}
        </div>
    );
}
