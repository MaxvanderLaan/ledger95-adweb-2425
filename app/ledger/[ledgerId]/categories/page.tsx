import CategoryForm from './categoryForm';
import CategoryTable from './categoryTable';

export default function CategoriesPage({ params }: { params: { ledgerId: string } }) {
    return (
        <main>
            <CategoryTable ledgerId={params.ledgerId} />
            <CategoryForm ledgerId={params.ledgerId} />
        </main>
    );
}
