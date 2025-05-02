import OverviewTable from './overviewTable';

export default function OverviewPage({ params }: { params: { ledgerId: string } }) {
    return <OverviewTable ledgerId={params.ledgerId} />;
}
