import BarGraph from './barGraph';

interface Props {
  params: {
    ledgerId: string;
  };
}

export default async function BarGraphPage({ params }: Props) {
    const { ledgerId } = await params;
    return <BarGraph ledgerId={ledgerId} />;
}
