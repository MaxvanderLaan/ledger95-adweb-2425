import styles from '@/app/ui/footer.module.css';
import Link from 'next/link';
import Clock from '@/app/ui/clock';
import Image from 'next/image';

export default function Footer() {
  return (
    <footer className="taskbar">
      <div className={styles.row}>
        <Link href="/login">
          <span className={styles.btn}>
            <Image width={32} height={32} src="/icons/windows-0.png" alt="windows95 logo"/>Login
          </span>
        </Link>
        <div className={styles.time}>
          <div className={styles.text}>
            <Clock />
          </div>
        </div>
      </div>
    </footer>
  );
}