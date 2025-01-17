"use client";

import { useGetProductsQuery } from "@/state/api";

const Inventory = () => {
    const { data: products, isError, isLoading } = useGetProductsQuery();

    if (isLoading) {
        return <div className="py-4">Loading...</div>
    }

    if (isError || !products) {
        return (
            <div className="text-center text-red-500 py-4">
                Failed to fetch products
            </div>
        )
    }

    return (
        <div className="flex flex-col">
            
        </div>
    )
}

export default Inventory