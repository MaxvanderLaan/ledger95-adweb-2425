export default function CategoriesPage({ params }: { params: { ledgerId: string } }) {
    return (
        <main>
            <h2>Overview for Ledger {params.ledgerId}</h2>
            <p>This is the categories content for the ledger.</p>
        </main>
    );
}
