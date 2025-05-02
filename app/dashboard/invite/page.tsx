'use client'

import { useState, useEffect, FormEvent } from "react";
import { useRouter } from 'next/navigation';
import { doc, updateDoc, getDocs, collection, query, where } from "firebase/firestore";
import { db } from '@/firebase';
import { useAuth } from '@/context/AuthContext';
import styles from '@/app/dashboard/invite/invite.module.css';

interface Ledger {
    id: string;
    name: string;
}

export default function InvitePage() {
    const [email, setEmail] = useState('');
    const [selectedLedgerId, setSelectedLedgerId] = useState('');
    const [ledgers, setLedgers] = useState<Ledger[]>([]);
    const [message, setMessage] = useState('');
    const router = useRouter();
    const { user } = useAuth();

    useEffect(() => {
        const fetchLedgers = async () => {
            if (!user) {
                setMessage("User is not authenticated");
                return;
            }

            try {
                const ledgersQuery = query(collection(db, 'ledgers'), where('owner', '==', user.uid));
                const ledgersSnapshot = await getDocs(ledgersQuery);
                const fetchedLedgers = ledgersSnapshot.docs.map((doc) => ({
                    id: doc.id,
                    name: doc.data().name,
                })) as Ledger[];
                setLedgers(fetchedLedgers);
            } catch (error) {
                setMessage("Error fetching ledgers: " + (error as Error).message);
            }
        };

        fetchLedgers();
    }, [user]);

    const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        if (!user) {
            setMessage("User is not authenticated");
            return;
        }

        try {
            const usersQuery = query(collection(db, 'users'), where('email', '==', email));
            const usersSnapshot = await getDocs(usersQuery);

            if (usersSnapshot.empty) {
                setMessage("No user found with this email");
                return;
            }

            const invitedUserDoc = usersSnapshot.docs[0];
            const invitedUserId = invitedUserDoc.id;

            const ledgerRef = doc(db, 'ledgers', selectedLedgerId);
            await updateDoc(ledgerRef, {
                [`members.${invitedUserId}`]: 'viewer'
            });

            setMessage("User invited successfully");
            setEmail('');
            setSelectedLedgerId('');
        } catch (error) {
            setMessage("Error inviting user: " + (error as Error).message);
        }
    };

    return (
        <main>
            <div className="container">
                <div className="card">
                    <div className="card-header main-header">
                        <div className="sub-header">
                            <h4>Invite User to Ledger</h4>
                        </div>
                    </div>
                    <div className="card-body">
                        <div className={styles.container}>
                            <form className="form-container" onSubmit={handleSubmit}>
                                <div className="form-item">
                                    <label className="form-label">Email</label>
                                    <input
                                        className="form-95 form-input"
                                        type="email"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        placeholder="Enter email of the user to invite..."
                                        required
                                    />
                                </div>
                                <div className="form-item">
                                    <label className="form-label">Select Ledger</label>
                                    <select
                                        className="form-95 form-input"
                                        value={selectedLedgerId}
                                        onChange={(e) => setSelectedLedgerId(e.target.value)}
                                        required
                                    >
                                        <option value="" disabled>Select a ledger</option>
                                        {ledgers.map((ledger) => (
                                            <option key={ledger.id} value={ledger.id}>
                                                {ledger.name}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                                <div className="form-button-item">
                                    <button type="submit" className="standard-button">Invite</button>
                                </div>
                            </form>
                            {message && <p className={styles.message}>{message}</p>}
                        </div>
                    </div>
                </div>
            </div>
        </main>
    );
}
