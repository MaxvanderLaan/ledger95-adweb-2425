'use client';

import styles from '@/app/ledger/[ledgerId]/categories/category.module.css';
import Link from 'next/link';

interface Props {
    name: string;
    budget: number;
    spent: number;
    maxWidth?: number;
    ledgerId: string;
}

export default function categoryRow({ name, budget, spent, maxWidth = 585, ledgerId }: Props) {
    const percentage = (spent / budget) * 100;

    return (
        <div className={styles.row}>
        {/* header part */}
        <div className={styles.header}>
            <div className={styles.info}>
                <div>{name}</div>
                <div>€{budget},-</div>
            </div>
            <div className={styles.actions}>
                <div><Link href={`/ledger/${ledgerId}/categories/edit`}><button className="standard-button">Edit</button></Link></div>
            </div>
        </div>
        {/* bar part */}
        <div className={styles.barContainer} style={{ maxWidth: `${maxWidth}px` }}>
            <div className={styles.bar} style={{ width: `${percentage}%` }}></div>
        </div>
    </div>
    );
}