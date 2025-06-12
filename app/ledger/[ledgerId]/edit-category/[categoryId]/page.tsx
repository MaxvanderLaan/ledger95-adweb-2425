'use client';

import { useState, useEffect, ChangeEvent, FormEvent } from "react";
import { useRouter, useParams } from "next/navigation";
import { db } from "@/firebase";
import { doc, updateDoc, getDocs, collection, getDoc, deleteDoc, addDoc, serverTimestamp, query, where } from "firebase/firestore";
import styles from "./edit.module.css";

interface Categories {
    id: string;
    budget: string;
    name: string;
    experation: Date;
}

export default function EditCategory() {
    const router = useRouter();
    const params = useParams() as { ledgerId: string; categoryId: string };
    const { ledgerId, categoryId } = params;
    const [category, setCategory] = useState<Categories | null>(null);
    const [loading, setLoading] = useState(true);

    //load categories into category state.
    useEffect(() => {
        const fetchCategory = async () => {
            const docRef = doc(db, 'categories', categoryId);
            const docSnap = await getDoc(docRef);
            if (docSnap.exists()) {
                const data = docSnap.data();
                setCategory({ id: docSnap.id, ...data } as Categories);
            }
            setLoading(false);
        };
        fetchCategory();
    }, [categoryId]);

    if (loading || !category) {
        return <div>Loading...</div>;
    }

    //handle form submissions
    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        if (!category) return;

        const categoryRef = doc(db, 'categories', category.id);
        await updateDoc(categoryRef, {
            name: category.name,
            budget: category.budget,
            experation: category.experation,
            updatedAt: serverTimestamp(),
        });

        router.push(`/ledger/${ledgerId}/categories`);
    };

    //handle delete action
    const handleDelete = async () => {
        if (!confirm("Are you sure you want to delete this category?")) {
            return;
        }

        try {
            await deleteDoc(doc(db, 'categories', category.id));
            router.push(`/ledger/${ledgerId}/categories`);
        } catch (error) {
            console.error("Error deleting transaction:", error);
        }
    };

    //update form field value based on user input
    const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setCategory((prev) => prev ? { ...prev, [name]: value } : null);
    };

    return (
        <div className={styles.container}>
            <form onSubmit={handleSubmit} className="form-container">
                <div className="form-item">
                    <label className="form-label">Budget</label>
                    <input type="text" id="budget" name="budget" value={category.budget} onChange={handleChange} className="form-95 form-input" />
                </div>
                <div className="form-item">
                    <label className="form-label">Date</label>
                    <input type="date" name="experation" value={category?.experation ? new Date(category.experation).toISOString().split('T')[0] : ''} onChange={handleChange} />
                </div>
                <div className="form-item">
                    <label className="form-label">Name</label>
                    <input type="text" id="name" name="name" value={category.name} onChange={handleChange} className="form-95 form-input" />
                </div>


                <div className={styles.buttonBar}>
                    <div className="form-button-item">
                        <button type="submit" className="standard-button">Save</button>
                    </div>
                    <div className="form-button-item">
                        <button type="button" onClick={handleDelete} className="standard-button">Delete</button>
                    </div>
                </div>
            </form>
        </div>
    );
}