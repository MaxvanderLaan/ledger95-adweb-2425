import CategoryForm from './categoryForm';
import CategoryTable from './categoryTable';
import styles from '@/app/ledger/[ledgerId]/categories/category.module.css';

export default function CategoriesPage({ params }: { params: { ledgerId: string } }) {
    return (
        <div className={styles.categoriesWrapper}>
            <CategoryTable ledgerId={params.ledgerId} />
            <CategoryForm ledgerId={params.ledgerId} />
        </div>
    );
}
