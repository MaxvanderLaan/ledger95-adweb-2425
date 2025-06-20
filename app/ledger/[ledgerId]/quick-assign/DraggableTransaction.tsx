'use client';

import { useDraggable } from '@dnd-kit/core';
import styles from './quickAssign.module.css';

interface Props {
    transaction: {
        id: string;
        amount: string;
        categoryId: string;
        date: any;
    };
    activeId: string | null;
    categoryName: string;
}

export default function DraggableTransaction({ transaction, activeId, categoryName }: Props) {
    const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({
        id: transaction.id,
    });

    if (transaction.id === activeId) return null;

    const style = {
        transform: transform
            ? `translate(${transform.x}px, ${transform.y}px)`
            : undefined,
        opacity: isDragging ? 0.5 : 1,
        cursor: 'grab',
    };

    return (
        <div ref={setNodeRef} style={style} {...listeners} {...attributes} className={styles.row}>
            <p className={`${styles.cell} ${styles.left}`}>{transaction.amount}</p>
            <p className={`${styles.cell} ${styles.middle}`}>
                {transaction.date.toDate().toLocaleDateString('en-US')}
            </p>
            <p className={`${styles.cell} ${styles.right}`}>
                {categoryName || ''}
            </p>
        </div>
    );
}
