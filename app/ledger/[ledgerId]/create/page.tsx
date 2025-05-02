import CreateForm from './createForm';

export default function CreatePage({ params }: { params: { ledgerId: string } }) {
    return <CreateForm ledgerId={params.ledgerId} />;
}
