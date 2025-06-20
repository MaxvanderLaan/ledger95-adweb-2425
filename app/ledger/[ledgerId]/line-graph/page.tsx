import LineGraph from './lineGraph';

interface Props {
  params: {
    ledgerId: string;
  };
}

export default async function LineGraphPage({ params }: Props) {
    const { ledgerId } = await params;
    return <LineGraph ledgerId={ledgerId} />;
}
