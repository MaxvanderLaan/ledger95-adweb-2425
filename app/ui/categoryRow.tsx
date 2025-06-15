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
    const isNegative = Boolean(spent < 0);
    let positivePercentage = 0;
    let widthPercentage = 0;
    let negativePercentage = 0;
    // WidthPercentage is used to fill in the bar, spentPercentage to calculate.

    if (!isNegative) {
        const leftover = budget - spent;
        const spentPercentage = leftover / (budget / 100)
        positivePercentage = 100 - spentPercentage
        widthPercentage = spentPercentage;

        // Check so green bar doesnt exceed its boundry.
        if (positivePercentage > 100) { widthPercentage = 100 }
    } else {
        const excess = Math.abs(spent) - budget
        negativePercentage = (excess / budget) * 100
    }

    console.log(expiration);
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

            {isNegative ? (
                <div className={styles.negativeBarContainer}>
                    <div className={styles.negativeBar} style={{ width: `${negativePercentage}%` }}>€{spent}</div>
                    <div className={styles.barFooter} style={{ width: `${negativePercentage}%` }}>
                        <div>0%</div>
                        <div>-{negativePercentage}%</div>
                    </div>
                </div>
            ) : (
                <div className={styles.positiveBarContainer}>
                    <div className={styles.positiveBar} style={{ width: `${widthPercentage}%` }}>€{spent}</div>
                    <div className={styles.barFooter} style={{ width: `${widthPercentage}%` }}>
                        <div>0%</div>
                        <div>{positivePercentage}%</div>
                    </div>
                </div>
            )}
        </div>
    );
}