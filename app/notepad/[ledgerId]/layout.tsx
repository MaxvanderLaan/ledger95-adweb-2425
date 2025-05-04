import { ReactNode } from 'react';
import Link from 'next/link';
import styles from '@/app/notepad/[ledgerId]/notepad.module.css';

export default async function NotepadLayout({ children, params }: { children: ReactNode, params: { ledgerId: string } }) {
    const { ledgerId } = await params;

    return (
        <main>
            <div className="container">
                <div className="card mb-4">
                    <div className={`card-header ${styles.header}`}>
                        <div className={styles.subHeader}>
                            <h4 className="my-0 font-weight-normal">Notepad.txt</h4>
                        </div>
                        <Link href="/dashboard">
                            <div className={`btn ${styles.closeButton}`}>
                                X
                            </div>
                        </Link>
                    </div>

                    <div className="card-body">
                        <div className={styles.notepad}>
                            <div className={styles.info}>
                                <div className={styles.items}>
                                <p><span className={styles.underline}>F</span>ile</p>
                                <p><span className={styles.underline}>E</span>dit</p>
                                <p><span className={styles.underline}>F</span>ormat</p>
                                <p><span className={styles.underline}>H</span>elp</p>
                                </div>
                            </div>
                            <div className={styles.textField}>
                                {children}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </main>
    );
}