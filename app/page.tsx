import styles from '@/app/home.module.css';
import { HelveticaBQ, Helvetica } from '@/app/ui/fonts';

export default function Home() {
  return (
    <div className={styles.logo}>
      <div>
        <img className={styles.image} src="/w95-logo-big.png" />
      </div>
      <div className={styles.text}>
        <div className={`${styles.company} ${Helvetica.className}`}>
          Michealsoft
        </div>
        <div className={styles.title}>
          <div className={`${styles.product} ${HelveticaBQ.className}`}>
            Ledger
          </div>
          <div className={`${styles.number} ${Helvetica.className}`}>
            95
          </div>
        </div>
      </div>
    </div>
  );
}
