import styles from '@/app/ui/ledger.module.css';
import Link from 'next/link';
import Image from 'next/image';

export default function Page({ params }: {
    params: { ledgerId: string }
}) {
    return (
        <main>
             <div className="container">
                <div className="card mb-4">
                    <div className={`card-header ${styles.header}`}>
                        <div className={styles.subHeader}>
                            <h4 className="my-0 font-weight-normal">Boekje {params.ledgerId}</h4>
                        </div>
                        <Link href="/">
                            <div className={`btn ${styles.closeButton}`}>
                                X
                            </div>
                        </Link>
                    </div>
                    <div className="card-body">
                    <div className={styles.ledger}>
                        <div className={styles.container}>

                        </div>
                        <div className={styles.buttonBar}>
                        {/* <div className="col-sm-10">
                            <button type="submit" className="btn btn-primary">Ok</button>
                        </div>
                        <div className="col-sm-10">
                            <button type="submit" className="btn btn-primary">Cancel</button>
                        </div> */}
                        </div>
                    </div>
                    </div>
                </div>
             </div>
        </main>
       
    );
}