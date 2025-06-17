'use client';

import { useDroppable } from '@dnd-kit/core';
import styles from './quickAssign.module.css';

interface Props {
    category: {
        id: string;
        name: string;
        budget: string;
        experation: any;
    };
}

export default function DroppableCategory({ category }: Props) {
    const { isOver, setNodeRef } = useDroppable({
        id: category.id,
    });

    const style = isOver
        ? {
              borderTopColor: '#00f',
              borderLeftColor: '#00f',
              borderRightColor: '#00f',
              borderBottomColor: '#00f',
          }
        : {};

    return (
        <div ref={setNodeRef} className={styles.categoryElement} style={style}>
            {category.name}
        </div>
    );
}
