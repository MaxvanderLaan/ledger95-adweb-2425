"use client";

import { FormEvent, useState } from "react";
import { collection, addDoc } from "firebase/firestore";
import { db } from '@/firebase';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import styles from '@/app/(dashboard-actions)/dashboard/create/create.module.css';

export default function Page() {
    const [name, setName] = useState<string>('');
    const [description, setDescription] = useState<string>('');
    const router = useRouter();
    const { user } = useAuth();
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        setLoading(true);
        setError('');

        if (!user) {
            setError("User is not authenticated.");
            return;
        }

        // Client-side validation.
        const nameRegex = /^[a-zA-Z0-9\s'-]{2,50}$/; // Only letters, numbers, space, apostrophe, dash
        if (!name.trim() || !nameRegex.test(name.trim())) {
            setError("Please enter a valid ledger name (2–50 characters, no special symbols).");
            setLoading(false);
            return;
        }

        const descriptionRegex = /^[a-zA-Z0-9\s'-]{2,150}$/; // Only letters, numbers, space, apostrophe, dash
        if (!description.trim() || !descriptionRegex.test(description.trim())) {
            setError("Please enter a valid ledger description (2–150 characters, no special symbols).");
            setLoading(false);
            return;
        }

        try {
            const docRef = await addDoc(collection(db, 'ledgers'), {
                name: name,
                description: description,
                owner: user.uid,
                members: {},
            });

            setName('');
            setDescription('');
            router.push('/dashboard');
        } catch (error) {
            setError('Failed to create ledger: ' + (error as Error).message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <main>
            <div className="container">
                <div className="card">
                    <div className="card-header main-header">
                        <div className="sub-header">
                            <Image width={16} height={16} src="/icons/help_book_cool-4.png" alt="help_book_cool" />
                            <h4>Create new ledger</h4>
                        </div>
                        <Link href="/dashboard"><div className="btn close-button">X</div></Link>
                    </div>
                    <div className="card-body"></div>
                    <div className={styles.container}>
                        {error && <p style={{ color: 'red' }}>{error}</p>}
                        <form className="form-container" onSubmit={handleSubmit}>
                            <div className="form-item">
                                <label className="form-label">Name</label>
                                <input className="form-95 form-input" type="text" value={name} onChange={(e) => setName(e.target.value)} placeholder="Name of new ledger..." />
                            </div>
                            <div className="form-item">
                                <label className="form-label">Description</label>
                                <input className="form-95 form-input" type="text" value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Description of new ledger..." />
                            </div>
                            <div className="form-button-item">
                                <button type="submit" className="standard-button">{loading ? 'Processing...' : 'Create'}</button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </main>
    );
}
