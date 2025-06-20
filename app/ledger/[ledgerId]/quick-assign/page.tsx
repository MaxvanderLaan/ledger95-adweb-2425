import QuickAssign from './quickAssign';

interface Props {
    params: Promise<{ ledgerId: string }>;
}

export default async function QuickAssignPage({ params }: Props) {
    const { ledgerId } = await params;
    return <QuickAssign ledgerId={ledgerId} />;
}
 