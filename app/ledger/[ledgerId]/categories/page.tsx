'use client';

import { use } from 'react';
import { useState, useEffect } from "react";
import { db } from '@/firebase';
import { collection, getDocs, query, where, Timestamp } from "firebase/firestore";
import CategoryForm from './categoryForm';
import CategoryTable from './categoryTable';
import styles from '@/app/ledger/[ledgerId]/categories/category.module.css';

interface Props {
    params: Promise<{ ledgerId: string }>;
}

interface Category {
    id: string;
    budget: string;
    name: string;
    expiration: Timestamp;
}

export default function CategoriesPage({ params }: Props) {
    const { ledgerId } = use(params);
    const [categories, setCategories] = useState<Category[]>([]);

    // Categories are fetched in page and passed to the table.
    // The setCategory is passed to the form part of the page.
    // This allows for a shared list between the table and the form.
    useEffect(() => {
        const fetchItems = async () => {
            const querySnapshot = await getDocs(query(collection(db, 'categories'), where('ledgerId', '==', ledgerId)));

            const invalidDateThreshhold = new Date();
            invalidDateThreshhold.setDate(invalidDateThreshhold.getDate() - 1); // Yesterday.

            const fetchedCategories: Category[] = querySnapshot.docs.map((doc) => ({
                id: doc.id,
                expiration: doc.data().expiration ?? null,
                ...doc.data(),
            }))
                .filter((category) => {
                    // Filter expired categories.
                    return !category.expiration || category.expiration.toDate() >= invalidDateThreshhold;
                }) as Category[];

            setCategories(fetchedCategories);
        };

        fetchItems();
    }, [ledgerId]);

    return (
        <div className={styles.categoriesWrapper}>
            <CategoryTable ledgerId={ledgerId} categories={categories} />
            <CategoryForm ledgerId={ledgerId} setCategories={setCategories} />
        </div>
    );
}
