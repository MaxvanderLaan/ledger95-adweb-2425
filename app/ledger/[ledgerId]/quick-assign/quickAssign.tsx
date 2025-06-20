'use client';

import styles from './quickAssign.module.css';
import { useState, useEffect } from "react";
import { db } from '@/firebase';
import { collection, query, where, updateDoc, doc, Timestamp, onSnapshot } from "firebase/firestore";
import { DndContext, DragEndEvent, DragStartEvent, closestCenter, DragOverlay } from '@dnd-kit/core';
import DraggableTransaction from './DraggableTransaction';
import DroppableCategory from './DroppableCategory';

interface Props {
    ledgerId: string;
}

interface Transaction {
    id: string;
    amount: string;
    categoryId: string;
    date: Timestamp;
}

interface Category {
    id: string;
    budget: string;
    name: string;
    experation: Timestamp;
}

export default function QuickAssign({ ledgerId }: Props) {
    const [transactions, setTransactions] = useState<Transaction[]>([]);
    const [categories, setCategories] = useState<Category[]>([]);
    const [activeId, setActiveId] = useState<string | null>(null);

    const categoriesMap = new Map(categories.map(cat => [cat.id, cat.name]));
    const activeTransaction = transactions.find(tx => tx.id === activeId) || null;

    useEffect(() => {
        const unsubscribeTransactions = onSnapshot(
            query(collection(db, 'transactions'), where('ledgerId', '==', ledgerId)),
            (querySnapshot) => {
                const fetched: Transaction[] = querySnapshot.docs.map((docSnap) => {
                    const data = docSnap.data();
                    return {
                        ...data,
                        id: docSnap.id,
                        date: data.date as Timestamp,
                    };
                }) as Transaction[];
                setTransactions(fetched);
            },
            (error) => {
                console.error("Error fetching transactions: ", error);
            }
        );

        const unsubscribeCategories = onSnapshot(
            query(collection(db, 'categories'), where('ledgerId', '==', ledgerId)),
            (querySnapshot) => {
                const fetched: Category[] = querySnapshot.docs.map((doc) => ({
                    id: doc.id,
                    ...doc.data(),
                })) as Category[];
                setCategories(fetched);
            },
            (error) => {
                console.error("Error fetching categories: ", error);
            }
        );

        return () => {
            unsubscribeTransactions();
            unsubscribeCategories();
        };
    }, [ledgerId]);

    const handleDragStart = (event: DragStartEvent) => {
        setActiveId(event.active.id as string);
    };

    const handleDragEnd = async (event: DragEndEvent) => {
        const { active, over } = event;
        setActiveId(null);

        if (!over) return;

        const transactionId = active.id as string;
        const categoryId = over.id as string;

        const previousTransactions = [...transactions];

        setTransactions(prev =>
            prev.map(tx =>
                tx.id === transactionId ? { ...tx, categoryId } : tx
            )
        );

        try {
            await updateDoc(doc(db, 'transactions', transactionId), { categoryId });
        } catch (error) {
            console.error('Failed to update transaction:', error);
            setTransactions(previousTransactions);
        }
    };

    return (
        <DndContext collisionDetection={closestCenter} onDragStart={handleDragStart} onDragEnd={handleDragEnd}>
            <div className={styles.QAContainer}>
                <div className={styles.table}>
                    <div className={styles.headers}>
                        <p className={`${styles.label} ${styles.left}`}>Amount</p>
                        <p className={`${styles.label} ${styles.middle}`}>Date</p>
                        <p className={`${styles.label} ${styles.right}`}>Category</p>
                    </div>
                    <div className={styles.content} style={{ overflowY: activeId ? 'hidden' : 'auto' }}>
                        {transactions.map(transaction => (
                            <DraggableTransaction key={transaction.id} transaction={transaction} categoryName={categoriesMap.get(transaction.categoryId) || ''} activeId={activeId}/>))}
                    </div>
                </div>

                <div className={styles.categories}>
                    {categories.map(category => (
                        <DroppableCategory key={category.id} category={category} />
                    ))}
                </div>
            </div>

            <DragOverlay>
                {activeTransaction ? (
                    <div className={styles.row} style={{ background: 'white', opacity: 0.9 }}>
                        <p className={`${styles.cell} ${styles.left}`}>{activeTransaction.amount}</p>
                        <p className={`${styles.cell} ${styles.middle}`}>
                            {activeTransaction.date.toDate().toLocaleDateString('en-US')}
                        </p>
                        <p className={`${styles.cell} ${styles.right}`}>
                            {categoriesMap.get(activeTransaction.categoryId) || 'Unassigned'}
                        </p>
                    </div>
                ) : null}
            </DragOverlay>
        </DndContext>
    );
}
