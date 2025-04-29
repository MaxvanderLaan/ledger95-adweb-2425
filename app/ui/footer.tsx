import styles from '@/app/ui/footer.module.css';
import Link from 'next/link';
import Clock from '@/app/ui/clock';

export default function Footer() {
  return (
    <footer className="taskbar">
      <div className={styles.row}>
        <Link href="/login">
          <span className={styles.btn}>
            <img src="/icons/windows-0.png" className="icon" />Login
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