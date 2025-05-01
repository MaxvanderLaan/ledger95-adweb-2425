export default function MonthlyPage({ params }: { params: { ledgerId: string } }) {
    return (
        <main>
            <h2>Overview for Ledger {params.ledgerId}</h2>
            <p>This is the monthly content for the ledger.</p>
        </main>

    );
}
