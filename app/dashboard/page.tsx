'use client'

import styles from '@/app/dashboard/dashboard.module.css';
import Link from 'next/link';
import Image from 'next/image';
import { useAuth } from '@/context/AuthContext';

export default function Page() {
    const { user } = useAuth();

    return (
        <main>
            <Link href="/dashboard/ledger">
                <div className={styles.folder}>
                    <div className={styles.box}>+</div>
                    <Image width={16} height={16} src="/icons/directory_open_file_mydocs-5.png" alt="directory_open_file_mydocs" />
                    <p>Ledger</p>
                </div>
            </Link>
            <Link href="/dashboard/archive">
            <div className={styles.folder}>
                <div className={styles.box}>+</div>
                <Image width={16} height={16} src="/icons/directory_open_file_mydocs-5.png" alt="directory_open_file_mydocs" />
                <p>Archive</p>
            </div>
            </Link>
        </main>
    );
}
