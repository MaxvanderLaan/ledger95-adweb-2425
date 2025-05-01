export default async function CreatePage({ params }: { params: Promise<{ ledgerId: string }> }) {
    const { ledgerId } = await params;
    
    return (
        <main>
            <h2>Overview for Ledger {ledgerId}</h2>
            <p>This is the create content for the ledger.</p>
        </main>

    );
}
