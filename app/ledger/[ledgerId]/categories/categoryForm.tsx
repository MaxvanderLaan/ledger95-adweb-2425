'use client';

import { FormEvent, useState } from "react";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { db } from '@/firebase';
import styles from '@/app/ledger/[ledgerId]/categories/category.module.css';

interface Props {
    ledgerId: string;
    setCategories: (categories: any) => void;
}

export default function CategoryForm({ ledgerId, setCategories }: Props) {
    const [name, setName] = useState<string>('');
    const [budget, setbudget] = useState<string>('');
    const [experation, setExperation] = useState<string>('');

    const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        try {
            const docRef = await addDoc(collection(db, 'categories'), {
                name, budget, experation, ledgerId
            });

            setCategories((prev: any) => [
                ...prev,
                {
                    id: docRef.id, name, budget, experation, ledgerId
                }
            ]);

            setName('');
            setbudget('');
            setExperation('');
        } catch (error) {
            console.error("Error adding document:", error);
        }
    };

    return (
            <div className={styles.form}>
                <form className="form-container" onSubmit={handleSubmit}>
                    <div className="form-item">
                        <label className="form-label">Name</label>
                        <input className="form-95 form-input" type="text" value={name} onChange={(e) => setName(e.target.value)} placeholder="Name of the category, e.g. Groceries" />
                    </div>
                    <div className="form-item">
                        <label className="form-label">Max budget</label>
                        <input className="form-95 form-input" type="text" value={budget} onChange={(e) => setbudget(e.target.value)} placeholder="The maximum budget, e.g. 5000" />
                    </div>
                    <div className="form-item">
                    <label className="form-label">Experation Date</label>
                    <input type="date" name="experation" value={experation} onChange={(e) => setExperation(e.target.value)} className="form-95 form-input" />
                </div>
                    <div className="form-button-item">
                        <button type="submit" className="standard-button">Create</button>
                    </div>
                </form>
            </div>
    );
}
