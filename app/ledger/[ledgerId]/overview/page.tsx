// app/ledger/[ledgerId]/overview/page.tsx

import styles from './overview.module.css';

export default async function OverviewPage({ params }: { params: Promise<{ ledgerId: string }> }) {
  const { ledgerId } = await params;

  return (
    <div className={styles.overview}>
      <h2>Overview for Ledger {ledgerId}</h2>
      <div className={styles.table}>
        <p>table row</p>
        <p>table row</p>
        <p>table row</p>
        <p>table row</p>
        <p>table row</p>
      </div>
    </div>
  );
}
