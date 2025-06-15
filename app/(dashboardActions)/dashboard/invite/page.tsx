'use client'

import { useState, useEffect, FormEvent } from "react";
import { useRouter } from 'next/navigation';
import { doc, updateDoc, getDocs, collection, query, where } from "firebase/firestore";
import { db } from '@/firebase';
import { useAuth } from '@/context/AuthContext';
import styles from '@/app/(dashboardActions)/dashboard/invite/invite.module.css';
import Link from 'next/link';

interface Ledger {
    id: string;
    name: string;
}

export default function InvitePage() {
    const [email, setEmail] = useState('');
    const [selectedLedgerId, setSelectedLedgerId] = useState('');
    const [ledgers, setLedgers] = useState<Ledger[]>([]);
    const router = useRouter();
    const { user } = useAuth();
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const fetchLedgers = async () => {
            if (!user) {
                setError("User is not authenticated");
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
                setError('Failed to fetch ledgers: ' + (error as Error).message);
            }
        };
        fetchLedgers();
    }, [user]);

    const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        setLoading(true);
        setError('');

        if (!user) {
            setError("User is not authenticated.");
            return;
        }

        try {
            const usersQuery = query(collection(db, 'users'), where('email', '==', email));
            const usersSnapshot = await getDocs(usersQuery);

            if (usersSnapshot.empty) {
                setError("No user found with this email");
                return;
            }

            const invitedUserDoc = usersSnapshot.docs[0];
            const invitedUserId = invitedUserDoc.id;

            const ledgerRef = doc(db, 'ledgers', selectedLedgerId);
            await updateDoc(ledgerRef, {
                [`members.${invitedUserId}`]: 'viewer'
            });

            setEmail('');
            setSelectedLedgerId('');
            router.push('/dashboard');
        } catch (error) {
            setError("Error inviting user: " + (error as Error).message);
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
                            <h4>Invite User to Ledger</h4>
                        </div>
                        <Link href="/dashboard">
                            <div className="btn close-button">X</div>
                        </Link>
                    </div>
                    <div className="card-body">
                        <div className={styles.container}>
                            {error && <p style={{ color: 'red' }}>{error}</p>}
                            <form className="form-container" onSubmit={handleSubmit}>
                                <div className="form-item">
                                    <label className="form-label">Email</label>
                                    <input className="form-95 form-input" type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Enter email of the user to invite..." required />
                                </div>
                                <div className="form-item">
                                    <label className="form-label">Select Ledger</label>
                                    <select className="form-95 form-input" value={selectedLedgerId} onChange={(e) => setSelectedLedgerId(e.target.value)} required>
                                        <option value="" disabled>Select a ledger</option>
                                        {ledgers.map((ledger) => (
                                            <option key={ledger.id} value={ledger.id}>
                                                {ledger.name}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                                <div className="form-button-item">
                                    <button type="submit" className="standard-button">{loading ? 'Processing...' : 'Invite'}</button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </main>
    );
}
