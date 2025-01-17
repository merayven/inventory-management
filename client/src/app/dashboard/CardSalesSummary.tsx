import { useGetDashboardMetricsQuery } from '@/state/api';
import { TrendingUp } from 'lucide-react';
import React, { useState, useMemo } from 'react';
import {
    Bar,
    BarChart,
    CartesianGrid,
    ResponsiveContainer,
    Tooltip,
    XAxis,
    YAxis,
} from 'recharts';

type SaleData = {
    date: string;
    totalValue: number;
    changePercentage?: number;
};

type Timeframe = 'daily' | 'weekly' | 'monthly';

const CardSalesSummary: React.FC = () => {
    const { data, isLoading, isError } = useGetDashboardMetricsQuery();
    const rawSaleData: SaleData[] = data?.salesSummary || [];

    const [timeframe, setTimeframe] = useState<Timeframe>('weekly');

    const groupDataByTimeframe = (data: SaleData[], timeframe: Timeframe): SaleData[] => {
        const groupedData: Record<string, SaleData> = {};

        data.forEach((item) => {
            const date = new Date(item.date);
            let key: string;

            if (timeframe === 'daily') {
                key = date.toISOString().split('T')[0]; // YYYY-MM-DD
            } else if (timeframe === 'weekly') {
                const week = Math.ceil((date.getDate() - date.getDay()) / 7);
                key = `${date.getFullYear()}-W${week}`;
            } else {
                key = `${date.getFullYear()}-${date.getMonth() + 1}`; // YYYY-MM
            }

            if (!groupedData[key]) {
                groupedData[key] = { date: key, totalValue: 0, changePercentage: 0 };
            }

            groupedData[key].totalValue += item.totalValue;
        });

        return Object.values(groupedData);
    };

    const saleData = useMemo(() => groupDataByTimeframe(rawSaleData, timeframe), [rawSaleData, timeframe]);

    const totalValueSum = saleData.reduce((acc, curr) => acc + curr.totalValue, 0) || 0;

    const averageChangePercentage = saleData.reduce((acc, curr, _, array) => {
        return acc + (curr.changePercentage || 0) / array.length;
    }, 0) || 0;

    const highestValueData = saleData.reduce((acc, curr) => {
        return acc.totalValue > curr.totalValue ? acc : curr;
    }, saleData[0] || {} as SaleData);

    const highestValueDate = highestValueData.date
        ? (timeframe === 'daily'
            ? new Date(highestValueData.date).toLocaleDateString('en-US', {
                month: 'numeric',
                day: 'numeric',
                year: '2-digit',
            })
            : highestValueData.date)
        : 'N/A';

    if (isError) {
        return <div className="m-5">Failed to fetch data</div>;
    }

    return (
        <div className="row-span-3 xl:row-span-6 bg-white shadow-md rounded-2xl flex flex-col justify-between">
            {isLoading ? (
                <div className="m-5">Loading...</div>
            ) : (
                <>
                    <div>
                        <h2 className="text-lg font-semibold mb-2 px-7 pt-5">Sales Summary</h2>
                        <hr />
                    </div>

                    <div>
                        <div className="flex justify-between items-center mb-6 px-7">
                            <div className="text-lg font-medium">
                                <p className="text-cs text-gray-400">Value</p>
                                <span className="text-2xl font-extrabold">
                                    ${totalValueSum.toLocaleString('en', { maximumFractionDigits: 2 })}
                                </span>
                                <span className="text-green-500 text-sm ml-2">
                                    <TrendingUp className="inline w-4 h-4 mr-1" />
                                    {averageChangePercentage.toFixed(2)}%
                                </span>
                            </div>
                            <select
                                className="shadow-sm border border-gray-300 bg-white px-4 py-1 appearance-none"
                                value={timeframe}
                                onChange={(e) => setTimeframe(e.target.value as Timeframe)}
                            >
                                <option value="daily">Daily</option>
                                <option value="weekly">Weekly</option>
                                <option value="monthly">Monthly</option>
                            </select>
                        </div>
                        <ResponsiveContainer width="100%" height={350} className="px-7">
                            <BarChart
                                data={saleData}
                                margin={{ top: 0, right: 0, left: -25, bottom: 0 }}
                            >
                                <CartesianGrid strokeDasharray="" vertical={false} />
                                <XAxis
                                    dataKey="date"
                                    tickFormatter={(value) => {
                                        if (timeframe === 'daily') {
                                            const date = new Date(value);
                                            return `${date.getMonth() + 1}/${date.getDate()}`;
                                        } else if (timeframe === 'weekly') {
                                            return value.replace('-W', ' W');
                                        } else if (timeframe === 'monthly') {
                                            const [year, month] = value.split('-');
                                            return `${month}/${year}`;
                                        }
                                        return value;
                                    }}
                                />
                                <YAxis
                                    tickFormatter={(value) =>
                                        `$${value.toLocaleString('en', {
                                            maximumFractionDigits: 2,
                                        })}`
                                    }
                                />
                                <Tooltip
                                    formatter={(value: number) => [`$${value.toLocaleString('en')}`]}
                                    labelFormatter={(label) => {
                                        if (timeframe === 'daily') {
                                            const date = new Date(label);
                                            return date.toLocaleDateString('en-US', {
                                                year: 'numeric',
                                                month: 'long',
                                                day: 'numeric',
                                            });
                                        }
                                        return label;
                                    }}
                                />
                                <Bar
                                    dataKey="totalValue"
                                    fill="#3182ce"
                                    barSize={10}
                                    radius={[10, 10, 0, 0]}
                                />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                    <div>
                        <hr />
                        <div className="flex justify-between items-center mt-6 text-sm px-7 mb-4">
                            <p>{saleData.length || 0} entries</p>
                            <p className="text-sm">
                                Highest Sales: <span className="font-bold">{highestValueDate}</span>
                            </p>
                        </div>
                    </div>
                </>
            )}
        </div>
    );
};

export default CardSalesSummary;
