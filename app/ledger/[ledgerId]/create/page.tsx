export default function CreatePage({ params }: { params: { ledgerId: string } }) {
  return (
    <main>
    <h2>Overview for Ledger {params.ledgerId}</h2>
    <p>This is the create content for the ledger.</p>
</main>
  );
}
