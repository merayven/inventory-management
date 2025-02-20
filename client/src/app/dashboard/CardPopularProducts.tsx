import { useGetDashboardMetricsQuery } from '@/state/api'
import { ShoppingBag } from 'lucide-react';
import React from 'react'


const CardPopularProducts = () => {
    const { data: dashboardMetrics, isLoading } = useGetDashboardMetricsQuery();

  return (
    <div className="row-span-3 xl:row-span-6 bg-white shadow-md rounded-xl">
        {isLoading ? (
            <div className="m-5">Loading...</div>
        ): (
            <>
                <h3 className="text-lg font-semibold px-7 pt-5 pb-2">
                    Popular Products
                </h3>
                <hr />
                <div className="overflow-auto h-full">
                    {dashboardMetrics?.popularProducts.map((product) => (
                        <div
                            key={product.productId}
                            className="flex items-center justify-between gap-3 px-5 py-7 border-b"
                        >
                            <div className="flex items-center gap-3">
                                <img src="" alt="" className="w-10 h-10" />
                                <div className="flex flex-col justify-between gap-1">
                                    <div className="font-bold text-gray-700">{product.name}</div>
                                    <div className="flex text-sm items-center">
                                        <span className="text-sm text-gray-700">{product.brand}</span>
                                        <span className="mx-2">|</span>
                                        <span className="font-bold text-blue-500 text-xs">
                                            ${product.price}
                                        </span>
                                    </div>
                                </div>
                            </div>

                            <div className="text-xs flex items-center">
                                <button className="p-2 rounded-full bg-blue-100 text-blue-600 mr-2">
                                    <ShoppingBag className="w-4 h-4" />
                                </button>
                                {Math.round(product.stockQuantity)} Sold
                            </div>
                        </div>
                    ))}
                </div>
            </>
        )}
    </div>
  )
}

export default CardPopularProducts