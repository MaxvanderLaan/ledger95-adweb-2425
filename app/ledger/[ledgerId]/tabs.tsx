import Link from 'next/link';
import styles from './ledger.module.css';

export default function Tabs({ ledgerId }: { ledgerId: string }) {
  return (
    <div className={styles.tabBar}>
      <Link href={`/ledger/${ledgerId}/overview`} className={styles.tab}>Overview</Link>
      <Link href={`/ledger/${ledgerId}/monthly`} className={styles.tab}>Monthly</Link>
      <Link href={`/ledger/${ledgerId}/line-graph`} className={styles.tab}>Line Graph</Link>
      <Link href={`/ledger/${ledgerId}/bar-graph`} className={styles.tab}>Bar Graph</Link>
      <Link href={`/ledger/${ledgerId}/categories`} className={styles.tab}>Categories</Link>
      <Link href={`/ledger/${ledgerId}/create`} className={styles.tab}>New Transaction</Link>
    </div>
  );
}
