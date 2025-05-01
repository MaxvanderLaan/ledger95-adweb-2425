export default async function LineGraphPage({ params }: { params: Promise<{ ledgerId: string }> }) {
    const { ledgerId } = await params;
    
    return (
        <main>
            <h2>Overview for Ledger {ledgerId}</h2>
            <p>This is the line graph content for the ledger.</p>
        </main>

    );
}
