import OverviewTable from './overviewTable';
import Create from './create';
import styles from './overview.module.css';

export default function OverviewPage({ params }: { params: { ledgerId: string } }) {
    return (
        <div className={styles.contentContainer}>
            <OverviewTable ledgerId={params.ledgerId} />
            <Create ledgerId={params.ledgerId} />
        </div>
    );
}