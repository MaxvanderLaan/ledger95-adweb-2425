'use client'

import styles from '@/app/dashboard/dashboard.module.css';
import Link from 'next/link';
import Image from 'next/image';
import { useState, useEffect } from "react";
import { db } from '@/firebase';
import { collection, getDocs } from "firebase/firestore";

interface Ledger {
    id: string;
    name: string;
    description: string;
}

export default function Page() {
    const [ledgers, setLedgers] = useState<Ledger[]>([]);

    useEffect(() => {
        const fetchItems = async () => {
            const querySnapshot = await getDocs(collection(db, 'ledgers'));
            const fetchedLedgers: Ledger[] = querySnapshot.docs.map((doc) => ({
                ...doc.data(),
                id: doc.id,
            })) as Ledger[];
            setLedgers(fetchedLedgers);
        };

        fetchItems();
    }, []);

    return (
        <main>
            <div className="container">
                <div className="card mb-4">
                    <div className="card-header main-header">
                        <div className="sub-header">
                            <Image width={16} height={16} src="/icons/directory_explorer-0.png" alt="directoryexplorer" />
                            <h4 className="my-0 font-weight-normal">Exploring - Boekje 3</h4>
                        </div>
                        <Link href="/">
                            <div className="btn close-button">
                                X
                            </div>
                        </Link>
                    </div>
                    <div className="card-body">
                        <div className={styles.explorer}>
                            <div className={styles.explorerOptions}>
                                <div className={styles.decorativeOptions}>
                                    <p><span className={styles.underline}>F</span>ile</p>
                                    <p><span className={styles.underline}>E</span>dit</p>
                                    <p><span className={styles.underline}>V</span>iew</p>
                                    <p><span className={styles.underline}>T</span>ools</p>
                                    <p><span className={styles.underline}>H</span>elp</p>
                                </div>
                                <div className={styles.functionalOptions}>
                                    <Link href={"/dashboard/create"}><span className={styles.underline}>C</span>reate</Link>
                                    <Link href={"/dashboard/edit"}><span className={styles.underline}>E</span>dit</Link>
                                </div>
                            </div>
                            <div className={styles.explorerHeader}>
                                <div className={styles.hiarchyHeader}>All Folders</div>
                                <div className={styles.folderHeader}>Contests of 'Boekje 3'</div>
                            </div>
                            <div className={styles.explorerContent}>
                                {/* file explorer */}
                                <div className={styles.hiarchyMain}>
                                    {/* toplevel */}
                                    <div>
                                        <div className={styles.folder}>
                                            <Image width={16} height={16} src="/icons/desktop_w95-0.png" alt="desktop_w95" />
                                            <p>Desktop</p>
                                        </div>
                                        {/* first level */}
                                        <div className={styles.firstLevel}>
                                            <div className={styles.folder}>
                                                <div className={styles.box}>-</div>
                                                <Image width={16} height={16} src="/icons/directory_open_file_mydocs-5.png" alt="directory_open_file_mydocs" />
                                                <p>Ledger</p>
                                            </div>
                                            {/* dynamic second level */}
                                            <div className={styles.secondLevel}>
                                                {ledgers.map((ledger) => (
                                                    <div key={ledger.id} className={styles.folder}>
                                                        <div className={styles.box}>+</div>
                                                        <Image width={16} height={16} src="/icons/directory_closed_cool-3.png" alt="ledger icon"/>
                                                        <p>{ledger.name}</p>
                                                    </div>
                                                ))}
                                                {/* <div className={styles.folder}>
                                                    <div className={styles.box}>+</div>
                                                    <Image width={16} height={16} src="/icons/directory_closed_cool-3.png" alt="directory_closed_cool" />
                                                    <p>Boekje 1</p>
                                                </div>
                                                <div className={styles.folder}>
                                                    <div className={styles.box}>+</div>
                                                    <Image width={16} height={16} src="/icons/directory_closed_cool-3.png" alt="directory_closed_cool" />
                                                    <p>Boekje 2</p>
                                                </div>
                                                <div className={`${styles.folder} ${styles.noBoxOffset}`}>
                                                    <Image width={16} height={16} src="/icons/directory_open_cool-3.png" alt="directory_open_cool" />
                                                    <p>Boekje 3</p>
                                                </div>
                                                <div className={styles.folder}>
                                                    <div className={styles.box}>+</div>
                                                    <Image width={16} height={16} src="/icons/directory_closed_cool-3.png" alt="directory_closed_cool" />
                                                    <p>Boekje 4</p>
                                                </div> */}
                                            </div>
                                            {/* rest of first level */}
                                            <div className={styles.folder}>
                                                <div className={styles.box}>+</div>
                                                <Image width={16} height={16} src="/icons/directory_open_file_mydocs-5.png" alt="directory_open_file_mydocs" />
                                                <p>Archive</p>
                                            </div>
                                            <div className={`${styles.folder} ${styles.noBoxOffset}`}>
                                                <Image width={16} height={16} src="/icons/recycle_bin_full_cool-0.png" alt="recycle_bin_full_cool" />
                                                <p>Recycle Bin</p>
                                            </div>
                                            <div className={`${styles.folder} ${styles.noBoxOffset}`}>
                                                <Image width={16} height={16} src="/icons/briefcase-4.png" alt="briefcase" />
                                                <p>My Briefcase</p>
                                            </div>
                                            <div className={`${styles.folder} ${styles.noBoxOffset}`}>
                                                <Image width={16} height={16} src="/icons/directory_closed_cool-3.png" alt="directory_open_cool" />
                                                <p>Online Services</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* (not yet) dynamic map with contests */}
                                <div className={styles.folderMain}>
                                    <div className={styles.folder}>
                                        <Image width={16} height={16} src="/icons/executable-0.png" alt="executable" />
                                        <p>Boekje3.exe</p>
                                    </div>
                                    <div className={styles.folder}>
                                        <Image width={16} height={16} src="/icons/notepad_file-2.png" alt="notepad" />
                                        <p>Description.txt</p>
                                    </div>
                                    <div className={styles.folder}>
                                        <Image width={16} height={16} src="/icons/notepad_file-2.png" alt="notepad" />
                                        <p>Invited.txt</p>
                                    </div>
                                </div>
                            </div>

                            <div className={styles.explorerFooter}>
                                <div className={styles.hiarchyBarFooter}>1 object(s) selected</div>
                                <div className={styles.folderBarFooter}>4.50KB</div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </main>
    );
}
