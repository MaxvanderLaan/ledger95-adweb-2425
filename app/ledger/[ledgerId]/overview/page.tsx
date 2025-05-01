import styles from '@/app/ledger/[ledgerId]/overview/overview.module.css';

export default function OverviewPage({ params }: { params: { ledgerId: string } }) {
  return (
    <div className={styles.overview}>
       <div className={styles.table}></div>
       <p>table row</p>
       <p>table row</p>
       <p>table row</p>
       <p>table row</p>
       <p>table row</p>       
       <p>table row</p>
    </div>
  );
}
