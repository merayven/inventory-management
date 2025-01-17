import React, { ChangeEvent, FormEvent, useState } from 'react'
import { v4 } from 'uuid';
import Header from '@/app/(components)/Header';

type ProductFormData = {
    brand: string;
    name: string;
    price: number;
    size: number;
    stockQuantity: number;
}

type CreateProductModalProps = {
    isOpen: boolean;
    onClose: () => void;
    onCreate: (formData: ProductFormData) => void;
}

const CreateProductModal = ({ isOpen, onClose, onCreate }: CreateProductModalProps) => {
    const [formData, setFormData] = useState({
        productId: v4(),
        brand: "",
        name: "",
        price: 0,
        size: 0,
        stockQuantity: 0,
    })

    const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
        const {name, value} = e.target;
        setFormData({
            ...formData,
            [name]:
                name=== "price" || name=== "size" || name=== "stockQuantity"
                    ? parseFloat(value) || 0
                    : value,
        })
    }

    const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        onCreate(formData);
        onClose();
    }

    if (!isOpen) return null;

    const labelCssStyles = "block text-sm font-medium text-gray-700"
    const inputCssStyles = "block w-full mb-2 p-2 border-gray-500 border-2 rounded-md"

    return (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-20">
            <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
                <Header name="Create New Product" />
                <form onSubmit={handleSubmit} className="mt-5">
                    {/* PRODUCT NAME */}
                    <label htmlFor="productName" className={labelCssStyles}>
                        Product Name
                    </label>
                    <input 
                        type="text" 
                        name="name" 
                        placeholder="Name" 
                        onChange={handleChange} 
                        value={formData.name} 
                        className={inputCssStyles}
                        required 
                    />

                    {/* PRODUCT BRAND */}
                    <label htmlFor="productBrand" className={labelCssStyles}>
                        Product Brand
                    </label>
                    <input 
                        type="text" 
                        name="brand" 
                        placeholder="Brand" 
                        onChange={handleChange} 
                        value={formData.brand} 
                        className={inputCssStyles}
                        required 
                    />

                    {/* PRODUCT SIZE */}
                    <label htmlFor="productSize" className={labelCssStyles}>
                        Product Size
                    </label>
                    <input 
                        type="number" 
                        name="size" 
                        placeholder="Size" 
                        onChange={handleChange} 
                        value={formData.size} 
                        className={inputCssStyles}
                        required 
                    />

                    {/* PRODUCT PRICE */}
                    <label htmlFor="productPrice" className={labelCssStyles}>
                        Product Price
                    </label>
                    <input 
                        type="number" 
                        name="price" 
                        placeholder="Price" 
                        onChange={handleChange} 
                        value={formData.price}
                        className={inputCssStyles}
                        required 
                    />

                    {/* STOCK QUANTITY */}
                    <label htmlFor="stockQuantity" className={labelCssStyles}>
                        Stock Quantity
                    </label>
                    <input
                        type="number"
                        name="stockQuantity"
                        placeholder="Stock Quantity"
                        onChange={handleChange}
                        value={formData.stockQuantity}
                        className={inputCssStyles}
                        required 
                    />

                    <button type="submit" className="mt-2 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-700">
                        Create
                    </button>
                    <button onClick={onClose} type="button" className="ml-2 px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-700">
                        Cancel
                    </button>
                </form>
            </div>
        </div>
    )
}

export default CreateProductModal