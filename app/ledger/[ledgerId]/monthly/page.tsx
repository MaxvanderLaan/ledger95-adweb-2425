import MonthlyTable from './monthlyTable';

export default function MonthlyPage({ params }: { params: { ledgerId: string } }) {
    return <MonthlyTable ledgerId={params.ledgerId} />;
}
