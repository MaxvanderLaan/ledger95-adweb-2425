'use client';

import { useState, useEffect } from 'react';
import { Line } from 'react-chartjs-2';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
    TimeScale,
} from 'chart.js';
import { db } from '@/firebase';
import { collection, query, where, onSnapshot } from 'firebase/firestore';
import 'chartjs-adapter-date-fns';
import styles from './lineGraph.module.css';

ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
    TimeScale
);

interface Props {
    ledgerId: string;
}

interface Transaction {
    id: string;
    amount: number;
    category: string;
    date: Date;
}

interface DailyData {
    date: string;
    total: number;
}

export default function LineGraph({ ledgerId }: Props) {
    const [dailyData, setDailyData] = useState<DailyData[]>([]);
    const [selectedMonth, setSelectedMonth] = useState<string>('');
    const [selectedYear, setSelectedYear] = useState<string>('');
    const [months, setMonths] = useState<string[]>([]);
    const [years, setYears] = useState<string[]>([]);

    useEffect(() => {
        const currentDate = new Date();
        const currentYear = currentDate.getFullYear().toString();
        const currentMonth = (currentDate.getMonth() + 1).toString().padStart(2, '0');
        setSelectedYear(currentYear);
        setSelectedMonth(currentMonth);
    }, []);

    useEffect(() => {
        const fetchTransactions = () => {
            const q = query(collection(db, 'transactions'), where('ledgerId', '==', ledgerId));
            const unsubscribe = onSnapshot(q, (querySnapshot) => {
                const transactions: Transaction[] = querySnapshot.docs.map((docSnap) => {
                    const data = docSnap.data();
                    return {
                        id: docSnap.id,
                        date: data.date.toDate(),
                        amount: parseFloat(data.amount),
                        category: data.category,
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

                const dailySums: { [key: string]: number } = {};
                filteredTransactions.forEach((transaction) => {
                    const dateKey = transaction.date.toISOString().slice(0, 10);
                    dailySums[dateKey] = (dailySums[dateKey] || 0) + transaction.amount;
                });

                if (selectedYear && selectedMonth) {
                    const daysInMonth = new Date(Number(selectedYear), Number(selectedMonth), 0).getDate();
                    let runningTotal = 0;
                    const completeData: DailyData[] = [];

                    for (let day = 1; day <= daysInMonth; day++) {
                        const dayString = day.toString().padStart(2, '0');
                        const dateStr = `${selectedYear}-${selectedMonth}-${dayString}`;
                        runningTotal += dailySums[dateStr] || 0;
                        completeData.push({ date: dateStr, total: runningTotal });
                    }
                    setDailyData(completeData);
                } else {
                    setDailyData([]);
                }
            });

            return () => unsubscribe();
        };

        fetchTransactions();
    }, [ledgerId, selectedMonth, selectedYear]);

    const handleMonthChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        setSelectedMonth(event.target.value);
    };

    const handleYearChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        setSelectedYear(event.target.value);
    };

    const data = {
        datasets: [
            {
                label: 'Cumulative Total',
                data: dailyData.map((dataPoint) => ({ x: dataPoint.date, y: dataPoint.total })),
                borderColor: 'rgba(75,192,192,1)',
                backgroundColor: 'rgba(75,192,192,0.2)',
                fill: false,
            },
        ],
    };

    const options = {
        responsive: true,
        scales: {
            x: {
                type: 'time' as const,
                time: {
                    unit: 'day' as const,
                },
                title: {
                    display: true,
                    text: 'Date',
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
                text: 'Cumulative Daily Transaction Totals',
            },
        },
    };

    return (
        <div className={styles.lineGraphContainer}>
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
            <Line data={data} options={options} />
        </div>
    );
}
