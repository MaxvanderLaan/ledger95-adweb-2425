'use client';

import { useState, useEffect } from 'react';
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip,Legend, } from 'chart.js';
import { db } from '@/firebase';
import { collection, query, where, onSnapshot } from 'firebase/firestore';
import styles from './barGraph.module.css';

ChartJS.register(
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend
);

interface Props {
    ledgerId: string;
}

interface Transaction {
    id: string;
    amount: number;
    categoryId: string;
    date: Date;
}

interface Category {
    id: string;
    name: string;
}

interface CategoryData {
    category: string;
    total: number;
}

export default function BarGraph({ ledgerId }: Props) {
    const [categoryData, setCategoryData] = useState<CategoryData[]>([]);
    const [selectedMonth, setSelectedMonth] = useState<string>('');
    const [selectedYear, setSelectedYear] = useState<string>('');
    const [months, setMonths] = useState<string[]>([]);
    const [years, setYears] = useState<string[]>([]);
    const [categories, setCategories] = useState<Category[]>([]);

    useEffect(() => {
        const currentDate = new Date();
        const currentYear = currentDate.getFullYear().toString();
        const currentMonth = (currentDate.getMonth() + 1).toString().padStart(2, '0');
        setSelectedYear(currentYear);
        setSelectedMonth(currentMonth);
    }, []);

    useEffect(() => {
        const fetchCategories = async () => {
            const q = query(collection(db, 'categories'), where('ledgerId', '==', ledgerId));
            const unsubscribe = onSnapshot(q, (querySnapshot) => {
                const fetchedCategories: Category[] = querySnapshot.docs.map((doc) => ({
                    id: doc.id,
                    ...doc.data(),
                })) as Category[];
                setCategories(fetchedCategories);
            });

            return () => unsubscribe();
        };

        fetchCategories();
    }, [ledgerId]);

    useEffect(() => {
        const fetchTransactions = async () => {
            const q = query(collection(db, 'transactions'), where('ledgerId', '==', ledgerId));
            const unsubscribe = onSnapshot(q, (querySnapshot) => {
                const transactions: Transaction[] = querySnapshot.docs.map((docSnap) => {
                    const data = docSnap.data();
                    return {
                        id: docSnap.id,
                        date: data.date.toDate(),
                        amount: parseFloat(data.amount),
                        categoryId: data.categoryId,
                    };
                });

                const uniqueMonths = new Set<string>();
                const uniqueYears = new Set<string>();

                transactions.forEach((transaction) => {
                    const month = transaction.date.toISOString().slice(0, 7);
                    const year = transaction.date.toISOString().slice(0, 4);
                    uniqueMonths.add(month);
                    uniqueYears.add(year);
                });

                setMonths(Array.from(uniqueMonths));
                setYears(Array.from(uniqueYears));

                const filteredTransactions = transactions.filter((transaction) =>
                    transaction.date.toISOString().startsWith(`${selectedYear}-${selectedMonth}`)
                );

                const categoryTotals: { [key: string]: number } = {};
                filteredTransactions.forEach((transaction) => {
                    const categoryName = categories.find(cat => cat.id === transaction.categoryId)?.name || 'Unknown';
                    categoryTotals[categoryName] = (categoryTotals[categoryName] || 0) + transaction.amount;
                });

                const categoryDataArray: CategoryData[] = Object.keys(categoryTotals).map((category) => ({
                    category,
                    total: categoryTotals[category],
                }));

                setCategoryData(categoryDataArray);
            });

            return () => unsubscribe();
        };

        fetchTransactions();
    }, [ledgerId, selectedMonth, selectedYear, categories]);

    const handleMonthChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        setSelectedMonth(event.target.value);
    };

    const handleYearChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        setSelectedYear(event.target.value);
    };

    const data = {
        labels: categoryData.map((dataPoint) => dataPoint.category),
        datasets: [
            {
                label: 'Total Amount',
                data: categoryData.map((dataPoint) => dataPoint.total),
                backgroundColor: 'rgba(75,192,192,0.2)',
                borderColor: 'rgba(75,192,192,1)',
                borderWidth: 1,
            },
        ],
    };

    const options = {
        responsive: true,
        scales: {
            x: {
                title: {
                    display: true,
                    text: 'Category',
                },
            },
            y: {
                title: {
                    display: true,
                    text: 'Amount',
                },
            },
        },
        plugins: {
            legend: {
                position: 'top' as const,
            },
            title: {
                display: true,
                text: 'Transactions per Category',
            },
        },
    };

    return (
        <div className={styles.barGraphContainer}>
            <div className={styles.dropdownContainer}>
                <label className={styles.dropdownLabel}>
                    Select Year:
                    <select value={selectedYear} onChange={handleYearChange}>
                        {years.map((year) => (
                            <option key={year} value={year}>
                                {year}
                            </option>
                        ))}
                    </select>
                </label>
                <label className={styles.dropdownLabel}>
                    Select Month:
                    <select value={selectedMonth} onChange={handleMonthChange}>
                        {months.map((month) => (
                            <option key={month} value={month.split('-')[1]}>
                                {new Date(month + '-01').toLocaleString('default', { month: 'long' })}
                            </option>
                        ))}
                    </select>
                </label>
            </div>
            <Bar data={data} options={options} />
        </div>
    );
}
