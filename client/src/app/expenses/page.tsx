"use client";

import { useGetExpenseByCategoryQuery } from "@/state/api";
import { useMemo, useState } from "react";
import Header from "@/app/(components)/Header";

const Expenses = () => {
    const [activeIndex, setActiveIndex] = useState(0);
    const [selectedCategory, setSelectedCategory] = useState("All");
    const [startDate, setStartDate] = useState("");
    const [endDate, setEndDate] = useState("");

    const { data: expensesData, isLoading, isError } = useGetExpenseByCategoryQuery();

    const expenses = useMemo(() => expensesData ?? [], [expensesData])

    const classNames = {
        label: "block text-sm font-medium text-gray-700",
        selectInput: "mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md appearance-none",
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
                            <select name="category" id="category" className={classNames.selectInput} defaultValue="All" onChange={(e) => setSelectedCategory(e.target.value)}>
                                <option>All</option>
                                <option>Office</option>
                                <option>Professional</option>
                                <option>Salaries</option>
                            </select>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Expenses