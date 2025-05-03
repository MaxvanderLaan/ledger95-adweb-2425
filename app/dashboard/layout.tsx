'use client'

import styles from '@/app/dashboard/dashboard.module.css';
import Link from 'next/link';
import Image from 'next/image';
import { LedgerProvider, useLedger } from '@/context/LedgerContext';
import { ReactNode } from 'react';

// We want to display some date conditional if the user has clicked a ledger to view. 
// We use a LedgerContest to track if a ledger has been selected and conditionally extract the needed data for the UI.

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
    // Ledgerprovider should wrap the layout, before its defined.
    return (
        <LedgerProvider>
            <DashboardContent>{children}</DashboardContent>
        </LedgerProvider>
    );
}

//TODO:  Desktop icons don't make any scence since refactoring. maybe change Dashboard icon to explorer? and move the icons down a inset. 

function DashboardContent({ children }: { children: ReactNode }) {
    const { ledger } = useLedger();

    return (
        <main>
            <div className="container">
                <div className="card mb-4">
                    <div className="card-header main-header">
                        <div className="sub-header">
                            <Image width={16} height={16} src="/icons/directory_explorer-0.png" alt="directoryexplorer" />
                            {ledger ? (
                                <h4 className="my-0 font-weight-normal">Exploring - {ledger.name}</h4>
                            ) : (
                                <h4 className="my-0 font-weight-normal">Exploring - Dashboard</h4>
                            )}
                        </div>
                        <Link href="/"><div className="btn close-button">X</div></Link>
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
                                    <Link href={"/dashboard/invite"}><span className={styles.underline}>I</span>nvite</Link>
                                </div>
                            </div>
                            <div className={styles.explorerHeader}>
                                <div className={styles.hiarchyHeader}>All Folders</div>
                                {ledger ? (
                                    <div className={styles.folderHeader}>Contests of {ledger.name}</div>
                                ) : (
                                    <div className={styles.folderHeader}></div>
                                )}
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
                                            {children}
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

                                {/* dynamic map with contests */}
                                {ledger ? (
                                    <div className={styles.folderMain}>
                                        {/* content that should change somewhat depending on the ledger selected */}
                                        <Link href={`/ledger/${ledger.id}/overview`} className={styles.link}>
                                            <div className={styles.folder}>
                                                <Image width={16} height={16} src="/icons/executable-0.png" alt="executable" />
                                                <p>{ledger.name}.exe</p>
                                            </div>
                                        </Link>
                                        <Link href={`/dashboard/ledger/${ledger.id}/description`} className={styles.link}>
                                            <div className={styles.folder}>
                                                <Image width={16} height={16} src="/icons/notepad_file-2.png" alt="notepad" />
                                                <p>Description.txt</p>
                                            </div>
                                        </Link>
                                        <Link href={`/dashboard/ledger/${ledger.id}/invited`} className={styles.link}>
                                            <div className={styles.folder}>
                                                <Image width={16} height={16} src="/icons/notepad_file-2.png" alt="notepad" />
                                                <p>Invited.txt</p>
                                            </div>
                                        </Link>
                                    </div>
                                ) : (
                                    <div className={styles.folderMain}></div>
                                )}
                            </div>

                            {ledger ? (
                                <div className={styles.explorerFooter}>
                                    <div className={styles.hiarchyBarFooter}>1 object(s) selected</div>
                                    <div className={styles.folderBarFooter}>4.50KB</div>
                                </div>
                            ) : (
                                <div className={styles.explorerFooter}>
                                    <div className={styles.hiarchyBarFooter}>0 object(s) selected</div>
                                    <div className={styles.folderBarFooter}>0KB</div>
                                </div>
                            )}

                        </div>
                    </div>
                </div>
            </div>
        </main>
    );
}
