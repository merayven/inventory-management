"use client";

import { useGetExpenseByCategoryQuery } from "@/state/api";
import { useMemo, useState } from "react";

const Expenses = () => {
    const [activeIndex, setActiveIndex] = useState(0);
    const [selectedCategory, setSelectedCategory] = useState("All");
    const [startDate, setStartDate] = useState("");
    const [endDate, setEndDate] = useState("");

    const { data: expensesData, isLoading, isError } = useGetExpenseByCategoryQuery();

    const expenses = useMemo(() => expensesData ?? [], [expensesData])

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
        <div>Expenses</div>
    )
}

export default Expenses