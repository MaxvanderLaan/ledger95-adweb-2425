export default function LineGraphPage({ params }: { params: { ledgerId: string } }) {
  return (
    <main>
    <h2>Overview for Ledger {params.ledgerId}</h2>
    <p>This is the line graph content for the ledger.</p>
</main>
  );
}
