'use client';

import { useState, useEffect, FormEvent } from "react";
import { db } from '@/firebase';
import styles from './overview.module.css';
import { getDocs, collection, addDoc, serverTimestamp, query, where, Timestamp } from "firebase/firestore";

interface Props {
    ledgerId: string;
}

interface Categories {
    id: string;
    budget: string;
    name: string;
    experation: Timestamp;
}

export default function CreateForm({ ledgerId }: Props) {
    const [amount, setAmount] = useState('');
    const [selectedCategoryId, setSelectedCategoryId] = useState('');
    const [categories, setCategories] = useState<Categories[]>([]);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const querySnapshot = await getDocs(query(collection(db, 'categories'), where('ledgerId', '==', ledgerId)));
                const fetchedCategories: Categories[] = querySnapshot.docs.map((doc) => {
                    const data = doc.data();
                    return {
                        ...data,
                        id: doc.id
                    };
                }) as Categories[];

                setCategories(fetchedCategories);
            } catch (error) {
                setError('Failed to fetch transactions: ' + (error as Error).message);
            }
        };

        fetchCategories();
    }, []);

    const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        setLoading(true);
        setError('');

        // Client-side validation.
        // Check if valid, not infinite and not 0.
        const parsedBudget = parseFloat(amount);
        if (isNaN(parsedBudget) || !isFinite(parsedBudget) || parsedBudget === 0) {
            setError("Amount must be a valid number and not zero.");
            setLoading(false);
            return;
        }

        try {
            const docRef = await addDoc(collection(db, 'transactions'), {
                amount: parseFloat(amount),
                ledgerId,
                date: serverTimestamp(),
                categoryId: selectedCategoryId
            });

            setSelectedCategoryId('');
            setAmount('');
        } catch (error) {
            setError('Failed to create transaction: ' + (error as Error).message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className={styles.create}>
            {error && <p style={{ color: 'red' }}>{error}</p>}
            <form className="form-container" onSubmit={handleSubmit}>
                <div className="form-item">
                    <label className="form-label">Amount</label>
                    <input className="form-95 form-input" type="text" value={amount} onChange={(e) => setAmount(e.target.value)} placeholder="The transaction amount, e.g. '-100' or '+100'" />
                </div>
                <div className="form-item">
                    <label className="form-label">Select Category</label>
                    <select className="form-95 form-input" value={selectedCategoryId} onChange={(e) => setSelectedCategoryId(e.target.value)}>
                        <option value="" disabled>Select a category</option>
                        {categories.map((category) => (
                            <option key={category.id} value={category.id}>
                                {category.name}
                            </option>
                        ))}
                    </select>
                </div>
                <div className="form-button-item">
                    <button type="submit" className="standard-button">{loading ? 'Processing...' : 'Create'}</button>
                </div>
            </form>
        </div>
    );
}