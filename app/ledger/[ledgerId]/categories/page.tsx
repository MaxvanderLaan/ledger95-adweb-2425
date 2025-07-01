'use client';

import { use } from 'react';
import { useState, useEffect } from "react";
import { db } from '@/firebase';
import { collection, query, where, Timestamp, onSnapshot } from "firebase/firestore";
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
            const q = query(collection(db, 'categories'), where('ledgerId', '==', ledgerId));
            const unsubscribe = onSnapshot(
                q,
                (querySnapshot) => {
                    try {
                        const invalidDateThreshhold = new Date();
                        invalidDateThreshhold.setDate(invalidDateThreshhold.getDate() - 1); // Yesterday.

                        const fetchedCategories: Category[] = querySnapshot.docs.map((doc) => ({
                            id: doc.id,
                            expiration: doc.data().expiration ?? null,
                            ...doc.data(),
                        }))
                            .filter((category) => {
                                // Filter expired categories.
                                if (!category.expiration) return true;
                                return category.expiration.toDate() >= invalidDateThreshhold;
                            }) as Category[];

                        setCategories(fetchedCategories);
                        setLoading(false);
                    } catch (err) {
                        setError('Error processing categories');
                        setLoading(false);
                        console.error('Error processing categories:', err);
                    }
                },
                (err) => {
                    setError('Error fetching categories');
                    setLoading(false);
                    console.error('Error fetching categories:', err);
                }
            );

            return () => unsubscribe();
        } catch (err) {
            setError('Failed to set up categories listener');
            setLoading(false);
            console.error('Failed to set up categories listener:', err);
        }
    }, [ledgerId]);

    if (loading) {
        return <div className={`${styles.categoriesWrapper} loadingMessage`}>Loading categories...</div>;
    }

    if (error) {
        return <div className={`${styles.categoriesWrapper} errorMessage`}>Error: {error}</div>;
    }

    return (
        <div className={styles.categoriesWrapper}>
            <CategoryTable ledgerId={ledgerId} categories={categories} />
            <CategoryForm ledgerId={ledgerId} />
        </div>
    );
}
