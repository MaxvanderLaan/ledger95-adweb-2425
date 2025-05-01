import { ReactNode } from 'react';
import Tabs from './tabs';
import styles from '@/app/ledger/[ledgerId]/ledger.module.css';
import Link from 'next/link';

export default async function LedgerLayout({ children, params }: { children: ReactNode, params: { ledgerId: string } }) {
    const { ledgerId } = await params;
    return (
        <main>
            <div className="container">
                <div className="card mb-4">
                    <div className={`card-header ${styles.header}`}>
                        <div className={styles.subHeader}>
                            <h4 className="my-0 font-weight-normal">Boekje {ledgerId}</h4>
                        </div>
                        <Link href="/">
                            <div className={`btn ${styles.closeButton}`}>
                                X
                            </div>
                        </Link>
                    </div>

                    <div className="card-body">
                        <div className={styles.ledger}>
                            <Tabs ledgerId={ledgerId} />
                            <div className={styles.content}>
                                {children}
                            </div>
                            <div className={styles.buttonBar}>
                                <div className="col-sm-10">
                                    <button type="submit" className="standard-button">Ok</button>
                                </div>
                                <div className="col-sm-10">
                                    <button type="submit" className="standard-button">Cancel</button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </main>
    );
}
