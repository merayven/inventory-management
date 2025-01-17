"use client";

import { useGetProductsQuery } from "@/state/api";
import Header from "@/app/(components)/Header";
import { DataGrid, GridColDef } from "@mui/x-data-grid";

const columns: GridColDef[] = [
    { field: "productId", headerName: "ID", width: 90 },
    { field: "name", headerName: "Product Name", width: 240 },
    { field: "brand", headerName: "Brand", width: 200 },
    { field: "size", headerName: "Size", width: 60, type: "number" },
    { field: "price", headerName: "Price", width: 110, type: "number", valueGetter: (value, row) => `$${row.price}` },
    { field: "stockQuantity", headerName: "Stock Quantity", width: 120, type: "number" },
]

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
            <Header name="Inventory" />
            <DataGrid
                rows={products}
                columns={columns}
                getRowId={(row) => row.productId}
                checkboxSelection
            />
        </div>
    )
}

export default Inventory