'use client';

import { useState, useEffect, ChangeEvent, FormEvent } from "react";
import { useRouter, useParams } from "next/navigation";
import { db } from "@/firebase";
import { doc, updateDoc, getDoc, deleteDoc, Timestamp, deleteField } from "firebase/firestore";
import styles from "./edit.module.css";

interface Categories {
    id: string;
    budget: string;
    name: string;
    expiration: string;
}

export default function EditCategory() {
    const router = useRouter();
    const params = useParams() as { ledgerId: string; categoryId: string };
    const { ledgerId, categoryId } = params;
    const [category, setCategory] = useState<Categories | null>(null);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    // Load categories into category state.
    useEffect(() => {
        const fetchCategory = async () => {
            try {
                const docRef = doc(db, 'categories', categoryId);
                const docSnap = await getDoc(docRef);
                if (docSnap.exists()) {
                    const data = docSnap.data();
                    setCategory({
                        id: docSnap.id,
                        name: data.name,
                        budget: data.budget,
                        expiration: data.expiration?.toDate().toISOString().split('T')[0] || ''
                    });
                }
            } catch (error) {
                setError('Failed to fetch category: ' + (error as Error).message);
            }
        };
        fetchCategory();
    }, [categoryId]);

    if (!category) {
        return null;
    }

    // Handle form submissions.
    const handleSubmit = async (event: FormEvent) => {
        event.preventDefault();
        setLoading(true);
        setError('');

        // Client-side validation.
        const nameRegex = /^[a-zA-Z0-9\s'-]{2,50}$/; // Only letters, numbers, space, apostrophe, dash
        if (!category.name.trim() || !nameRegex.test(category.name.trim())) {
            setError("Please enter a valid category name (2–50 characters, no special symbols).");
            setLoading(false);
            return;
        }

        // Check if valid, not infinite and not 0 or negative.
        const parsedBudget = parseFloat(category.budget);
        if (isNaN(parsedBudget) || !isFinite(parsedBudget) || parsedBudget <= 0) {
            setError("Budget must be a positive number greater than zero.");
            setLoading(false);
            return;
        }

        // Check if date is valid if filled, and not in the past.
        if (category.expiration) {
            const date = new Date(category.expiration);

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
            const categoryRef = doc(db, 'categories', category.id);

            const updateData: any = {
                name: category.name,
                budget: category.budget
            };

            // If date is included, update it. If it's empty, empty the field in the db.
            if (category.expiration) {
                updateData.expiration = Timestamp.fromDate(new Date(category.expiration));
            } else {
                updateData.expiration = deleteField();
            }

            await updateDoc(categoryRef, updateData);
            router.push(`/ledger/${ledgerId}/categories`);
        } catch (error) {
            setError('Failed to edit category: ' + (error as Error).message);
        } finally {
            setLoading(false);
        }
    };

    // Handle delete action.
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

    // Update form field value based on user input.
    const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
        const { name, value } = event.target;
        setCategory((prev) => prev ? { ...prev, [name]: value } : null);
    };

    return (
        <div className={styles.container}>
            {error && <p style={{ color: 'red' }}>{error}</p>}
            <form onSubmit={handleSubmit} className="form-container">
                <div className="form-item">
                    <label className="form-label">Name</label>
                    <input type="text" id="name" name="name" value={category.name} onChange={handleChange} className="form-95 form-input" />
                </div>
                <div className="form-item">
                    <label className="form-label">Budget</label>
                    <input type="text" id="budget" name="budget" value={category.budget} onChange={handleChange} className="form-95 form-input" />
                </div>
                <div className="form-item">
                    <label className="form-label">Date</label>
                    <input type="date" id="date" name="expiration" value={category.expiration} onChange={handleChange} className="form-95 form-input" />
                </div>

                <div className={styles.buttonBar}>
                    <div className="form-button-item">
                        <button type="submit" className="standard-button">{loading ? 'Processing...' : 'Save'}</button>
                    </div>
                    <div className="form-button-item">
                        <button type="button" onClick={handleDelete} className="standard-button">Delete</button>
                    </div>
                </div>
            </form>
        </div>
    );
}