import OverviewTable from './overviewTable';
import Create from './create';
import styles from './overview.module.css';

interface Props {
    params: Promise<{ ledgerId: string }>;
}

export default async function OverviewPage({ params }: Props) {
    const { ledgerId } = await params;

    return (
        <div className={styles.contentContainer}>
            <OverviewTable ledgerId={ledgerId} />
            <Create ledgerId={ledgerId} />
        </div>
    );
}