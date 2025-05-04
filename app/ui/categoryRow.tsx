'use client';

import styles from '@/app/ledger/[ledgerId]/categories/category.module.css';
import Link from 'next/link';

interface Props {
    name: string;
    budget: number;
    spent: number;
    maxWidth?: number;
    ledgerId: string;
    experation: string;
}

export default function categoryRow({ name, budget, spent, ledgerId, experation }: Props) {
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

    return (
        <div className={styles.row}>
            <div className={styles.header}>
                <div className={styles.info}>
                    <div>{name}</div>
                    <div>€{budget},-</div>
                </div>
                <div className={styles.actions}>
                    {experation ? (
                        <div className={styles.experation}>Expires on: {experation}</div>
                    ) : (
                        <div className={styles.experation}></div>
                    )}
                    <Link href={`/ledger/${ledgerId}/categories/edit`}>
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