import { useGetDashboardMetricsQuery } from '@/state/api';
import React, { useState } from 'react'

const CardSalesSummary = () => {
    const { data, isLoading, isError } = useGetDashboardMetricsQuery();
    const saleData = data?.salesSummary || [];

    const [timeframe, setTimeframe] = useState("weekly");

    if (isError) {
        return <div className="m-5">Failed to fetch data</div>
    }

  return (
    <div className="row-span-3 xl:row-span-6 bg-gray-500">CardSalesSummary</div>
  )
}

export default CardSalesSummary