'use client';

import { useState, useEffect, ChangeEvent, FormEvent } from "react";
import { useRouter, useParams } from "next/navigation";
import { db } from "@/firebase";
import { doc, updateDoc, getDocs, collection, getDoc, deleteDoc, addDoc, serverTimestamp, Timestamp, query, where } from "firebase/firestore";
import styles from "./edit.module.css";

interface TransactionData {
    amount: string;
    date: string; //ISO string, only for input.
}

interface Categories {
    id: string;
    budget: string;
    name: string;
    experation: Timestamp;
}

export default function EditTransaction() {
    const router = useRouter();
    const params = useParams() as { ledgerId: string; transactionId: string };
    const { ledgerId, transactionId } = params;
    const [selectedCategoryId, setSelectedCategoryId] = useState('');
    const [categories, setCategories] = useState<Categories[]>([]);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const [transaction, setTransaction] = useState<TransactionData>({
        amount: "",
        date: "",
    });

    useEffect(() => {
        const fetchTransaction = async () => {
            try {
                const transactionRef = doc(db, "transactions", transactionId);
                const snapshot = await getDoc(transactionRef);
                if (snapshot.exists()) {
                    const data = snapshot.data();
                    const dateObj = data.date.toDate();
                    setTransaction({
                        amount: data.amount,
                        date: data.date.toDate().toISOString().split('T')[0],
                    });
                    setSelectedCategoryId(data.categoryId || '');
                }
            } catch (error) {
                setError('Failed to fetch transaction: ' + (error as Error).message);
            }
        };
        fetchTransaction();
    }, [transactionId]);

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
                setError('Failed to fetch categories: ' + (error as Error).message);
            }
        };
        fetchCategories();
    }, []);


    const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
        const { name, value } = event.target;
        setTransaction((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleSubmit = async (event: FormEvent) => {
        event.preventDefault();
        setLoading(true);
        setError('');

        // Client-side validation.
        // Check if valid, not infinite and not 0 or negative.
        const parsedAmount = parseFloat(transaction.amount);
        if (isNaN(parsedAmount) || !isFinite(parsedAmount) || parsedAmount === 0) {
            setError("Amount must be a valid number and not zero.");
            setLoading(false);
            return;
        }

        try {
            const transactionRef = doc(db, "transactions", transactionId);
            await updateDoc(transactionRef, {
                amount: transaction.amount,
                date: Timestamp.fromDate(new Date(transaction.date)),
                categoryId: selectedCategoryId,
            });

            router.push(`/ledger/${ledgerId}/overview`);
        } catch (error) {
            setError('Failed to edit transaction: ' + (error as Error).message);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async () => {
        if (!confirm("Are you sure you want to delete this transaction?")) {
            return;
        }
        try {
            const transactionRef = doc(db, "transactions", transactionId);
            await deleteDoc(transactionRef);
            router.push(`/ledger/${ledgerId}/overview`);
        } catch (error) {
            console.error("Error deleting transaction:", error);
        }
    };

    return (
        <div className={styles.container}>
            {error && <p style={{ color: 'red' }}>{error}</p>}
            <form onSubmit={handleSubmit} className="form-container">
                <div className="form-item">
                    <label className="form-label">Amount</label>
                    <input type="text" id="amount" name="amount" value={transaction.amount} onChange={handleChange} className="form-95 form-input" />
                </div>
                <div className="form-item">
                    <label className="form-label">Date</label>
                    <input type="date" id="date" name="date" value={transaction.date} onChange={handleChange} className="form-95 form-input" />
                </div>

                <div className="form-item">
                    <label className="form-label">Category</label>
                    <select className="form-95 form-input" value={selectedCategoryId} onChange={(e) => setSelectedCategoryId(e.target.value)}>
                        <option value="" disabled>Select a category</option>
                        {categories.map((category) => (
                            <option key={category.id} value={category.id}>
                                {category.name}
                            </option>
                        ))}
                    </select>
                </div>

                <div className={styles.buttonBar}>
                    <div className="form-button-item">
                        <button type="submit" className="standard-button">{loading ? 'Processing...' : 'Save'}</button>
                    </div>
                    <div className="form-button-item">
                        <button onClick={handleDelete} className="standard-button">Delete</button>
                    </div>
                </div>
            </form>
        </div>
    );
}
