"use client";

import { FormEvent, useState, useEffect } from "react";
import { collection, getDocs, doc, updateDoc } from "firebase/firestore";
import { db } from '@/firebase';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import styles from '@/app/dashboard/edit/edit.module.css';

interface Ledger {
    id: string;
    name: string;
    description: string;
    archived: boolean;
}

// All ledgers will be available here for editing, even archived ones.
// Edit will be the main way to archive / de-archive ledgers.
export default function Page() {
    const [ledgers, setLedgers] = useState<Ledger[]>([]);
    const [selectedId, setSelectedId] = useState<string>('');
    const [name, setName] = useState<string>('');
    const [description, setDescription] = useState<string>('');
    const [archived, setArchived] = useState<boolean>(false);
    const router = useRouter();

    useEffect(() => {
        const fetchItems = async () => {
            const querySnapshot = await getDocs(collection(db, 'ledgers'));
            const fetchedLedgers: Ledger[] = querySnapshot.docs.map((doc) => ({
                ...doc.data(),
                id: doc.id,
            })) as Ledger[];
            setLedgers(fetchedLedgers);
        };

        fetchItems();
    }, []);

    const handleLedgerSelect = (id: string) => {
        setSelectedId(id);
        const selected = ledgers.find((l) => l.id === id);
        if (selected) {
            setName(selected.name);
            setDescription(selected.description);
            setArchived(Boolean(selected.archived));
        }
    };

    const handleUpdate = async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        if (!selectedId) return;

        try {
            const ledgerRef = doc(db, 'ledgers', selectedId);
            await updateDoc(ledgerRef, {
                name,
                description,
                archived,
            });
            router.push('/dashboard');
        } catch (error) {
            console.error("Error updating document: ", error);
        }
    };

    return (
        <main>
            <div className="container">
                <div className="card">
                    <div className="card-header main-header">
                        <div className="sub-header">
                            <Image width={16} height={16} src="/icons/write_wordpad-1.png" alt="write_wordpad" />
                            <h4>Edit excisting ledger</h4>
                        </div>
                        <Link href="/dashboard">
                            <div className="btn close-button">X</div>
                        </Link>
                    </div>
                    <div className="card-body"></div>
                    <div className={styles.container}>
                        {/* dropdown list */}
                        <div className="form-item">
                            <label className="form-label">Select a ledger</label>
                            <select className="form-95 form-input" onChange={(e) => handleLedgerSelect(e.target.value)} value={selectedId}>
                                <option value="">-- Select a ledger --</option>
                                {ledgers.map((ledger) => (
                                    <option key={ledger.id} value={ledger.id}>
                                        {ledger.name}
                                    </option>
                                ))}
                            </select>
                        </div>
                        {/* Form */}
                        {selectedId && (
                            <form className="form-container" onSubmit={handleUpdate}>
                                <div className="form-item">
                                    <label className="form-label">Name</label>
                                    <input className="form-95 form-input" type="text" value={name} onChange={(e) => setName(e.target.value)} placeholder="Ledger name..."
                                    />
                                </div>
                                <div className="form-item">
                                    <label className="form-label">Description</label>
                                    <input className="form-95 form-input" type="text" value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Ledger description..." />
                                </div>

                                <div className="form-item">
                                    <label className="form-label">Archive</label>
                                    <div className="form-check">
                                        <input id="archived" type="checkbox" className="form-checkbox" checked={archived} onChange={(e) => setArchived(e.target.checked)}/>
                                        <label htmlFor="archived" className="form-check-label"></label>
                                    </div>

                                </div>
                                <div className="form-button-item">
                                    <button type="submit" className="standard-button">
                                        Save Changes
                                    </button>
                                </div>
                            </form>
                        )}
                    </div>
                </div>
            </div>
        </main>
    )
}