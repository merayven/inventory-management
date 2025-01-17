"use client";

import { useGetProductsQuery } from "@/state/api";
import { useState } from "react"

const Products = () => {
    const [searchTerm, setSearchTerm] = useState("");
    const [isModalOpen, setIsModalOpen] = useState(false);

    const { data: products, isLoading, isError } = useGetProductsQuery(searchTerm);

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
        <div className="mx-auto pb-5 w-full">

        </div>
    )
}

export default Products