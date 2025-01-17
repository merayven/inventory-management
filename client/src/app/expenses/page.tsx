"use client";

import { ExpenseByCategorySummary, useGetExpenseByCategoryQuery } from "@/state/api";
import { useMemo, useState } from "react";
import Header from "@/app/(components)/Header";
import { Cell, Legend, Pie, PieChart, ResponsiveContainer, Tooltip } from "recharts";

type AggregatedDataItem = {
    name: string;
    color?: string;
    amount: number;
}

type AggregatedData = {
    [category: string]: AggregatedDataItem;
}

const Expenses = () => {
    const [activeIndex, setActiveIndex] = useState(0);
    const [selectedCategory, setSelectedCategory] = useState("All");
    const [startDate, setStartDate] = useState("");
    const [endDate, setEndDate] = useState("");

    const { data: expensesData, isLoading, isError } = useGetExpenseByCategoryQuery();

    const expenses = useMemo(() => expensesData ?? [], [expensesData])

    const parseDate = (dateString: string) => {
        const date = new Date(dateString);
        return date.toISOString().split("T")[0];
    }

    const aggregatedData: AggregatedDataItem[] = useMemo(() => {
        const filtered: AggregatedData = expenses.filter((data: ExpenseByCategorySummary) => {
            const matchesCategory = selectedCategory === "All" || data.category === selectedCategory;
            const dataDate = parseDate(data.date);
            const matchesDate = !startDate || !endDate || (dataDate >= startDate && dataDate <= endDate);
            return matchesCategory && matchesDate;
        }).reduce((acc: AggregatedData, data: ExpenseByCategorySummary) => {
            const amount = parseInt(data.amount);
            if (!acc[data.category]) {
                acc[data.category] = { name: data.category, amount: 0 };
                acc[data.category].color = `#${Math.floor(Math.random() * 16777215).toString(16)}`;
                acc[data.category].amount += amount;
            }
            return acc;
        }, {})

        return Object.values(filtered);
    }, [expenses, selectedCategory, startDate, endDate])

    const classNames = {
        label: "block text-sm font-medium text-gray-700",
        selectContainer: "relative mt-1",
        selectInput: "block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md appearance-none",
        arrowIcon: "absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none text-gray-500",
    }

    if (isLoading) {
        return <div className="py-4">Loading...</div>
    }

    if (isError || !expensesData) {
        return (
            <div className="text-center text-red-500 py-4">
                Failed to fetch expenses
            </div>
        )
    }

    return (
        <div>
            <div className="mb-5">
                <Header name="Expenses" />
                <p className="text-sm text-gray-500">
                    A visual representation of expenses over time
                </p>
            </div>

            <div className="flex flex-col md:flex-row">
                <div className="w-full md:w-1/3 bg-white shadow rounded-lg p-6">
                    <h3 className="text-lg font-semibold mb-4">
                        Filter By Category and Date
                    </h3>
                    <div className="space-y-4">
                        <div>
                            <label htmlFor="category" className={classNames.label}>
                                Category
                            </label>
                            <div className={classNames.selectContainer}>
                                <select
                                    name="category"
                                    id="category"
                                    className={classNames.selectInput}
                                    defaultValue="All"
                                    onChange={(e) => setSelectedCategory(e.target.value)}
                                >
                                    <option>All</option>
                                    <option>Office</option>
                                    <option>Professional</option>
                                    <option>Salaries</option>
                                </select>
                                {/* Arrow Icon */}
                                <div className={classNames.arrowIcon}>
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        className="h-5 w-5"
                                        viewBox="0 0 20 20"
                                        fill="currentColor"
                                    >
                                        <path
                                            fillRule="evenodd"
                                            d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 011.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                                            clipRule="evenodd"
                                        />
                                    </svg>
                                </div>
                            </div>
                        </div>

                        <div>
                            <label htmlFor="start-date" className={classNames.label}>
                                Start Date
                            </label>
                            <div className={classNames.selectContainer}>
                                <input
                                    name="start-date"
                                    type="date"
                                    id="start-date"
                                    className={classNames.selectInput}
                                    onChange={(e) => setStartDate(e.target.value)}
                                />
                            </div>
                        </div>

                        <div>
                            <label htmlFor="end-date" className={classNames.label}>
                                End Date
                            </label>
                            <div className={classNames.selectContainer}>
                                <input
                                    name="end-date"
                                    type="date"
                                    id="end-date"
                                    className={classNames.selectInput}
                                    onChange={(e) => setEndDate(e.target.value)}
                                />
                            </div>
                        </div>
                    </div>
                </div>
                {/* CHART */}
                <div className="flex-grow bg-white shadow rounded-lg p-4 md:p-6">
                    <ResponsiveContainer width="100%" height={400}>
                        <PieChart>
                            <Pie
                                data={aggregatedData}
                                cx="50%"
                                cy="50%"
                                label
                                outerRadius={150}
                                fill="#8884d8"
                                dataKey="amount"
                                onMouseEnter={(_, index) => setActiveIndex(index)}
                            >
                                {aggregatedData.map(
                                    (entry: AggregatedDataItem, index: number) => (
                                        <Cell key={`cell-${index}`} fill={index === activeIndex ? "rgb(29, 78, 216)" : entry.color} />
                                    )
                                )}
                            </Pie>
                            <Tooltip />
                            <Legend />
                        </PieChart>
                    </ResponsiveContainer>
                </div>
            </div>
        </div>
    )
}

export default Expenses;
