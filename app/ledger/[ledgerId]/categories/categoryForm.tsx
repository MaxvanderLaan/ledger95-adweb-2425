'use client';

import { FormEvent, useState } from "react";
import { collection, addDoc, Timestamp } from "firebase/firestore";
import { db } from '@/firebase';
import styles from '@/app/ledger/[ledgerId]/categories/category.module.css';

interface Props {
    ledgerId: string;
    setCategories: (categories: any) => void;
}

export default function CategoryForm({ ledgerId, setCategories }: Props) {
    const [name, setName] = useState('');
    const [budget, setBudget] = useState('');
    const [expiration, setExpiration] = useState('');
    const [success, setSuccess] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        setLoading(true);
        setError('');
        setSuccess('');

        const nameRegex = /^[a-zA-Z0-9\s'-]{2,50}$/; // Only letters, numbers, space, apostrophe, dash
        if (!name.trim() || !nameRegex.test(name.trim())) {
            setError("Please enter a valid category name (2–50 characters, no special symbols).");
            setLoading(false);
            return;
        }

        const parsedBudget = parseFloat(budget);
        if (isNaN(parsedBudget) || !isFinite(parsedBudget) || parsedBudget <= 0) {
            setError("Budget must be a positive number greater than zero.");
            setLoading(false);
            return;
        }

        if (expiration) {
            const date = new Date(expiration);

            if (isNaN(date.getTime())) {
                setError("Expiration date is invalid.");
                setLoading(false);
                return;
            }

            date.setHours(0, 0, 0, 0);
            const today = new Date();
            today.setHours(0, 0, 0, 0);

            if (date < today) {
                setError("Expiration date cannot be in the past.");
                setLoading(false);
                return;
            }
        }

        try {
            const dataToSave: any = { name, budget, ledgerId };

            if (expiration) {
                dataToSave.expiration = Timestamp.fromDate(new Date(expiration));
            }

            const docRef = await addDoc(collection(db, 'categories'), dataToSave);

            setCategories((prev: any) => {
                const newCategory: any = {
                    id: docRef.id, name, budget, ledgerId,
                };

                if (expiration) {
                    newCategory.expiration = Timestamp.fromDate(new Date(expiration));
                }

                return [...prev, newCategory];
            });

            setName('');
            setBudget('');
            setExpiration('');
            setSuccess('Succesfully created category');
        } catch (error) {
            setError('Failed to create category: ' + (error as Error).message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className={styles.form}>
            {error && <p style={{ color: 'red' }}>{error}</p>}
            {success && <p style={{ color: 'green' }}>{success}</p>}
            <form className="form-container" onSubmit={handleSubmit}>
                <div className="form-item">
                    <label className="form-label">Name</label>
                    <input className="form-95 form-input" type="text" value={name} onChange={(e) => setName(e.target.value)} placeholder="Name of the category, e.g. Groceries" />
                </div>
                <div className="form-item">
                    <label className="form-label">Max budget</label>
                    <input className="form-95 form-input" type="text" value={budget} onChange={(e) => setBudget(e.target.value)} placeholder="The maximum budget, e.g. 5000" />
                </div>
                <div className="form-item">
                    <label className="form-label">Expiration Date</label>
                    <input type="date" name="expiration" value={expiration} onChange={(e) => setExpiration(e.target.value)} className="form-95 form-input" />
                </div>
                <div className="form-button-item">
                    <button type="submit" className="standard-button">{loading ? 'Processing...' : 'Create'}</button>
                </div>
            </form>
        </div>
    );
}
