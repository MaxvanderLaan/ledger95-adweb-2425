import LineGraph from './lineGraph';

export default function LineGraphPage({ params }: { params: { ledgerId: string } }) {
    return <LineGraph ledgerId={params.ledgerId} />;
}
