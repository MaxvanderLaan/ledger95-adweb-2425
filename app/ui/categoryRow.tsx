'use client';

import styles from '@/app/ledger/[ledgerId]/categories/category.module.css';
import Link from 'next/link';
import { Timestamp } from 'firebase/firestore';

interface Props {
    name: string;
    budget: number;
    spent: number;
    maxWidth?: number;
    ledgerId: string;
    expiration?: Timestamp;
    id: string;
}

export default function categoryRow({ name, budget, spent, ledgerId, expiration, id }: Props) {
    let widthPercentage = 0;
    let positivePercentage = 0;
    let negativePercentage = 0;

    if (budget === 0) {
        widthPercentage = 0;
        positivePercentage = 0;
    } else {
        const remaining = budget + spent; // spent is negative if funds remain
        const percentage = (remaining / budget) * 100;

        widthPercentage = Math.max(0, Math.min(percentage, 100)); // Clamp between 0–100 for bar
        positivePercentage = percentage;

        if (percentage < 0) {
            negativePercentage = Math.abs(percentage);
        }
    }

    const formatExpirationDate = (ts: Timestamp) => {
        if (!ts || !ts.toDate) return '';
        const date = ts.toDate();
        const yyyy = date.getFullYear();
        const mm = String(date.getMonth() + 1).padStart(2, '0');
        const dd = String(date.getDate()).padStart(2, '0');
        return `Expires on: ${mm}-${dd}-${yyyy}`;
    };

    return (
        <div className={styles.row}>
            <div className={styles.header}>
                <div className={styles.info}>
                    <div>{name}</div>
                    <div>€{budget},-</div>
                </div>
                <div className={styles.actions}>
                    {expiration ? (
                        <div className={styles.expiration}>{formatExpirationDate(expiration)}</div>
                    ) : (
                        <div className={styles.expiration}></div>
                    )}
                    <Link href={`/ledger/${ledgerId}/edit-category/${id}`}>
                        <button className="standard-button">Edit</button>
                    </Link>
                </div>
            </div>

            {positivePercentage >= 0 ? (
                <div className={styles.positiveBarContainer}>
                    <div className={styles.positiveBar} style={{ width: `${widthPercentage}%` }}>
                        €{(budget + spent).toLocaleString()}
                    </div>
                    <div className={styles.barFooter} style={{ width: `${widthPercentage}%` }}>
                        <div>0%</div>
                        <div>{positivePercentage.toFixed(0)}%</div>
                    </div>
                </div>
            ) : (
                <div className={styles.negativeBarContainer}>
                    <div className={styles.negativeBar} style={{ width: `${negativePercentage}%` }}>
                        -€{Math.abs(budget + spent).toLocaleString()}
                    </div>
                    <div className={styles.barFooter} style={{ width: `${negativePercentage}%` }}>
                        <div>0%</div>
                        <div>-{negativePercentage.toFixed(0)}%</div>
                    </div>
                </div>
            )}
        </div>
    );
}
