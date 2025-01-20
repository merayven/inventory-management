"use client";

import { useCreateProductMutation, useGetProductsQuery } from "@/state/api";
import { PlusCircleIcon, SearchIcon } from "lucide-react";
import { useState } from "react"
import Header from "@/app/(components)/Header";
import CreateProductModal from "./CreateProductModal";

type ProductFormData = {
    name: string;
    brand: string;
    size: number;
    price: number;
    stockQuantity: number;
}

const Products = () => {
    const [searchTerm, setSearchTerm] = useState("");
    const [isModalOpen, setIsModalOpen] = useState(false);

    const { data: products, isLoading, isError } = useGetProductsQuery(searchTerm);

    const [createProduct] = useCreateProductMutation();
    const handleCreateProduct = async (productData: ProductFormData) => {
        await createProduct(productData);
    }

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
            <div className="flex items-center border-2 border-gray-200 rounded mb-4">
                <SearchIcon className="w-5 h-5 text-gray-500 m-2" />
                <input className="w-full py-2 px-4 rounded bg-white" placeholder="Search product..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
            </div>

            <div className="flex justify-between items-center mb-6">
                <Header name="Products" />
                <button
                    className="flex items-center bg-blue-500 hover:bg-blue-700 text-gray-200 font-bold py-2 px-4 rounded"
                    onClick={() => setIsModalOpen(true)}
                >
                    <PlusCircleIcon className="w-5 h-5 mr-2 !text-gray-200" />
                    Create Product
                </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10 justify-between">
                {isLoading ? (<div>Loading...</div>) : (
                    products?.map((product) => (
                        <div key={product.productId} className=" border shadow rounded-md p-4 max-w-full w-full mx-auto">
                            <div className="flex flex-col items-center">
                                <img src="" alt="" className="w-20 h-20" />
                                <h3 className="text-lg text-gray-900 font-semibold">{product.name}</h3>
                                <h4 className="text-gray-700">{product.brand}</h4>
                                <p className="mt-1">Size: <span className="font-semibold">{product.size}</span></p>
                                <p className="text-gray-800 pt-1">${product.price.toFixed(2)}</p>
                                <div className="text-sm text-gray-600 mt-1">
                                    Stock: {product.stockQuantity}
                                </div>
                            </div>
                        </div>
                    ))
                )}
            </div>
            <CreateProductModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} onCreate={handleCreateProduct} />
        </div>
    )
}

export default Products