import { useGetDashboardMetricsQuery } from '@/state/api';
import { TrendingUp } from 'lucide-react';
import React, { useState } from 'react'

const CardSalesSummary = () => {
    const { data, isLoading, isError } = useGetDashboardMetricsQuery();
    const saleData = data?.salesSummary || [];

    const [timeframe, setTimeframe] = useState("weekly");

    const totalValueSum = saleData.reduce((acc, curr) => acc + curr.totalValue, 0) || 0;

    const averageChangePercentage = saleData.reduce((acc, curr, _, array) => {
        return acc + curr.changePercentage! / array.length;
    }, 0) || 0;

    if (isError) {
        return <div className="m-5">Failed to fetch data</div>
    }

  return (
    <div className="row-span-3 xl:row-span-6 bg-white shadow-md rounded-2xl flex flex-col justify-between">
        {isLoading ? (
            <div className="m-5">Loading...</div>
        ): (
            <>
                <div>
                    <h2 className="text-lg font-semibold mb-2 px-7 pt-5">
                        Sales Summary
                    </h2>
                </div>

                <div>
                    <div className="flex justify-between items-center mb-6 px-7">
                        <div className="text-lg font-medium">
                            <p className="text-cs text-gray-400">Value</p>
                            <span className="text-2xl font-extrabold">
                                ${(totalValueSum / 1000000).toLocaleString("en", {maximumFractionDigits: 2,})}m
                            </span>
                            <span className="text-green-500 text-sm ml-2">
                                <TrendingUp className="inline w-4 h-4 mr-1" />
                                {averageChangePercentage.toFixed(2)}%
                            </span>
                        </div>
                    </div>
                </div>
            </>
        )}
    </div>
  )
}

export default CardSalesSummary