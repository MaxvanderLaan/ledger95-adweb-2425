'use client';

import { use } from 'react';
import { useState, useEffect } from "react";
import { db } from '@/firebase';
import { collection, getDocs, query, where } from "firebase/firestore";
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
    experation: string;
}

export default function CategoriesPage({ params }: Props) {
    const { ledgerId } = use(params);
    const [categories, setCategories] = useState<Category[]>([]);

    useEffect(() => {
        const fetchItems = async () => {
            const querySnapshot = await getDocs(query(collection(db, 'categories'), where('ledgerId', '==', ledgerId)));
            const fetchedCategories: Category[] = querySnapshot.docs.map((doc) => ({
                id: doc.id,
                ...doc.data(),
            })) as Category[];

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
