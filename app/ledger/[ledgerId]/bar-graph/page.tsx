export default function BarGraphPage({ params }: { params: { ledgerId: string } }) {
    return (
        <main>
            <h2>Overview for Ledger {params.ledgerId}</h2>
            <p>This is the bar graph content for the ledger.</p>
        </main>
    );
}
