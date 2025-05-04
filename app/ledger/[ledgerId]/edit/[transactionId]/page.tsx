'use client';

import { useState, useEffect, ChangeEvent, FormEvent } from "react";
import { useRouter, useParams } from "next/navigation";
import { db } from "@/firebase";
import { doc, getDoc, updateDoc, deleteDoc } from "firebase/firestore";
import styles from "./edit.module.css";

interface TransactionData {
    amount: string;
    date: string;
}

export default function EditTransaction() {
    const router = useRouter();
    const params = useParams() as { ledgerId: string; transactionId: string };
    const { ledgerId, transactionId } = params;

    const [transaction, setTransaction] = useState<TransactionData>({
        amount: "",
        date: "",
    });
    const [loading, setLoading] = useState(true);

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
                        date: dateObj.toISOString().split("T")[0],
                    });
                } else {
                    console.error("Transaction not found");
                }
            } catch (error) {
                console.error("Error fetching transaction:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchTransaction();
    }, [transactionId]);

    const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setTransaction((prev) => ({
        ...prev,
        [name]: value,
        }));
    };

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        try {
            const transactionRef = doc(db, "transactions", transactionId);
            await updateDoc(transactionRef, {
                amount: transaction.amount,
                date: new Date(transaction.date),
            });
            router.push(`/ledger/${ledgerId}/overview`);
        } catch (error) {
            console.error("Error updating transaction:", error);
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

    if (loading) {
        return <p>Loading...</p>;
    }

    return (
        <div className={styles.container}>
            <h1 className={styles.heading}>Edit Transaction</h1>
            <form onSubmit={handleSubmit} className={styles.form}>
                <div className={styles.formField}>
                    <label htmlFor="amount" className={styles.label}>
                        Amount:
                    </label>
                    <input
                        type="text"
                        id="amount"
                        name="amount"
                        value={transaction.amount}
                        onChange={handleChange}
                        className={styles.input}
                    />
                </div>
                <div className={styles.formField}>
                    <label htmlFor="date" className={styles.label}>
                        Date:
                    </label>
                    <input
                        type="date"
                        id="date"
                        name="date"
                        value={transaction.date}
                        onChange={handleChange}
                        className={styles.input}
                    />
                </div>
                <button type="submit" className={`${styles.button} ${styles.submitButton}`}>
                    Save Changes
                </button>
            </form>
            <button onClick={handleDelete} className={`${styles.button} ${styles.deleteButton}`}>
                Delete Transaction
            </button>
        </div>
    );
}
