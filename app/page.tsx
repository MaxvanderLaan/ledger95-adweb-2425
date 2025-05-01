"use client";

import styles from '@/app/home.module.css';
import { HelveticaBQ, Helvetica } from '@/app/ui/fonts';
import Image from 'next/image';

export default function Home() {
  return (
    <div className={styles.logo}>
      <div className={styles.imageWrapper}>
        <Image src="/w95-logo-big.png" alt="windows 95 logo" fill className={styles.image} />
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
