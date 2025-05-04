'use client';

import { useParams } from 'next/navigation';
import { useState, useEffect } from "react";
import { db } from '@/firebase';
import { doc, getDoc, getDocs, collection, query, where } from "firebase/firestore";

interface MemberEntry {
    id: string;
    email: string;
}

export default function Page() {
    const [members, setMembers] = useState<MemberEntry[]>([]);
    const [loading, setLoading] = useState(true);

    const params = useParams();
    const ledgerId = params.ledgerId as string;

    useEffect(() => {
        const fetchMembersEmails = async () => {
            if (!ledgerId) return;

            try {
                const ledgerDocRef = doc(db, 'ledgers', ledgerId);
                const ledgerSnap = await getDoc(ledgerDocRef);

                if (!ledgerSnap.exists()) {
                    console.warn("No such ledger document!");
                    setMembers([]);
                    return;
                }

                const data = ledgerSnap.data();

                const membersMap = data?.members;
                if (!membersMap || typeof membersMap !== 'object') {
                    console.warn("Members field is missing or invalid.");
                    setMembers([]);
                    return;
                }

                const memberIds = Object.keys(membersMap);
                if (memberIds.length === 0) {
                    setMembers([]);
                    return;
                }

                const batchSize = 10;
                const fetchedMembers: MemberEntry[] = [];

                for (let i = 0; i < memberIds.length; i += batchSize) {
                    const batchIds = memberIds.slice(i, i + batchSize);
                    const usersRef = collection(db, 'users');
                    const usersQuery = query(usersRef, where('uid', 'in', batchIds));
                    const usersSnapshot = await getDocs(usersQuery);

                    usersSnapshot.forEach(doc => {
                        const data = doc.data();
                        fetchedMembers.push({
                            id: data.uid,
                            email: data.email,
                        });
                    });
                }

                setMembers(fetchedMembers);
            } catch (error) {
                console.error("Error fetching members' emails:", error);
                setMembers([]);
            } finally {
                setLoading(false);
            }
        };

        fetchMembersEmails();
    }, [ledgerId]);

    return (
        <main>
            {loading ? (
                <p>Loading...</p>
            ) : members.length > 0 ? (
                <div>
                    {members.map((member) => (
                        <div key={member.id}>{member.email}</div>
                    ))}
                </div>
                
            ) : (
                <p>No members found.</p>
            )}
        </main>
    );
}
