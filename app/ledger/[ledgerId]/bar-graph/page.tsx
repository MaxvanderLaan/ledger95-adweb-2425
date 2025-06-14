import BarGraph from './barGraph';

export default function BarGraphPage({ params }: { params: { ledgerId: string } }) {
    return <BarGraph ledgerId={params.ledgerId} />;
}
