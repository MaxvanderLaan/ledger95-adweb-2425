import MonthlyTable from './monthlyTable';

interface Props {
  params: {
    ledgerId: string;
  };
}

export default async function MonthlyPage({ params }: Props) {
    const { ledgerId } = await params;

    return <MonthlyTable ledgerId={ledgerId} />;
}
