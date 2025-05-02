'use client';

import { FormEvent, useState } from "react";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { db } from '@/firebase';
import styles from '@/app/ledger/[ledgerId]/create/create.module.css';

interface Props {
    ledgerId: string;
}

export default function CreateForm({ ledgerId }: Props) {
    const [amount, setAmount] = useState('');

    const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        try {
            const docRef = await addDoc(collection(db, 'transactions'), {
                amount: parseFloat(amount),
                ledgerId,
                date: serverTimestamp(),
            });
            console.log("Written document with ID:", docRef.id);
            setAmount('');
        } catch (error) {
            console.error("Error adding document:", error);
        }
    };

    return (
       <main>
            <div className={styles.container}>
            <form className="form-container" onSubmit={handleSubmit}>
            <div className="form-item">
                <label className="form-label">Amount</label>
                <input className="form-95 form-input" type="text" value={amount} onChange={(e) => setAmount(e.target.value)} placeholder="The transaction amount, e.g. '-100' or '+100'"/>
            </div>
            <div className="form-button-item">
                <button type="submit" className="standard-button">Create</button>
            </div>
        </form>
            </div>
            <div className={styles.recentlyAddedContainer}>

            </div>
            <div className={styles.categoriesContainer}></div>
       </main>
    );
}