"use client";

import { Bar, BarChart, CartesianGrid, Legend, Line, XAxis, YAxis, Tooltip } from "recharts";
import {
    ChartConfig,
    ChartContainer,
    ChartTooltip,
    ChartTooltipContent,
} from "@/components/ui/chart";
import { useEffect, useState } from "react";
import { getAmountbyMoth, getAmountbyyear } from "@/utils/db/actions";

type ChartData = {
    report: number;
    collect: number;
    month: string;
};

export default function WasteChart() {
    const [year, setYear] = useState(2024); // Trạng thái để quản lý năm
    const [monthlyAmounts, setMonthlyAmounts] = useState<ChartData[]>([]);

    const [sumYear, setSumYear] = useState(0);
    const [totalCollect, setTotalCollect] = useState(0);
    const [totalReport, setTotalReport] = useState(0);

    const chartConfig = {
        report: {
            label: "Rác báo cáo",
            color: "#22c55e",
        },
        collect: {
            label: "Rác thu gom",
            color: "#ef4444",
        },
    } satisfies ChartConfig;

    const getAmountForMonth = async (month: string): Promise<ChartData> => {
        const getWaste = await getAmountbyMoth(`${year}-${month}`);
        let report = 0;
        let collect = 0;

        getWaste?.forEach(({ amountCollect, amountReport }) => {
            collect += parseFloat(amountCollect || "0");
            report += parseFloat(amountReport || "0");
        });

        return { month: `Tháng ${parseInt(month, 10)}`, report, collect };
    };

    const getAmountForYear = async () => {
        const getWaste = await getAmountbyyear(year.toString());
        return (
            getWaste?.reduce((init, { amount }) => init + parseFloat(amount), 0) || 0
        );
    };

    useEffect(() => {
        const fetchData = async () => {
            try {
                const amounts = await Promise.all(
                    Array.from({ length: 12 }, (_, i) =>
                        getAmountForMonth((i + 1).toString().padStart(2, "0"))
                    )
                );
                setMonthlyAmounts(amounts);
                setSumYear(await getAmountForYear());

                // Tổng hợp dữ liệu rác thu gom và báo cáo
                const totalReport = amounts.reduce((sum, item) => sum + item.report, 0);
                const totalCollect = amounts.reduce(
                    (sum, item) => sum + item.collect,
                    0
                );
                setTotalReport(totalReport);
                setTotalCollect(totalCollect);
            } catch (error) {
                console.error("Lỗi khi lấy dữ liệu rác", error);
            }
        };
        fetchData();
    }, [year]); // Gọi lại khi năm thay đổi

    // Tính toán tỷ lệ tăng giảm
    const calculateRateOfChange = (data: number[]): number[] => {
        const rateOfChange = [];
        for (let i = 1; i < data.length; i++) {
            const rate = ((data[i] - data[i - 1]) / data[i - 1]) * 100;
            rateOfChange.push(rate);
        }
        rateOfChange.unshift(0); // Đặt giá trị tăng giảm cho tháng đầu tiên là 0
        return rateOfChange;
    };

    // Dữ liệu cho tỷ lệ tăng giảm
    const reportRates = calculateRateOfChange(monthlyAmounts.map((item) => item.report));
    const collectRates = calculateRateOfChange(monthlyAmounts.map((item) => item.collect));

    return (
        <div className="w-full mx-auto p-6 bg-white shadow-md rounded-lg ">
            <h1 className="text-3xl font-semibold text-gray-800 mb-6 text-center">
                Báo cáo rác năm {year}
            </h1>

            {/* Đặt khoảng cách giữa biểu đồ và các nút */}
            <div className="mb-8"> 
                <div className="flex flex-wrap justify-center items-start gap-20">
                    {/* Biểu đồ cột */}
                    <ChartContainer
                        config={chartConfig}
                        className="flex-1 min-w-[300px] max-w-[900px]"
                    >
                        <BarChart data={monthlyAmounts} barCategoryGap="5%">
                            <CartesianGrid vertical={false} />
                            <XAxis
                                dataKey="month"
                                tickLine={false}
                                tickMargin={12}
                                axisLine={false}
                                angle={0}
                                textAnchor="end"
                            />
                            <YAxis />
                            <Legend
                                layout="horizontal"
                                verticalAlign="top"
                                align="center"
                                iconType="circle"
                            />
                            <Tooltip content={<ChartTooltipContent />} />
                            <Bar
                                dataKey="report"
                                fill={chartConfig.report.color}
                                radius={4}
                                name={chartConfig.report.label}
                            />
                            <Bar
                                dataKey="collect"
                                fill={chartConfig.collect.color}
                                radius={4}
                                name={chartConfig.collect.label}
                            />
                            {/* Đường tỷ lệ tăng giảm cho rác báo cáo */}
                            <Line
                                type="monotone"
                                dataKey="reportRate"
                                data={monthlyAmounts.map((item, index) => ({
                                    month: item.month,
                                    reportRate: reportRates[index],
                                }))}
                                stroke="#22c55e"
                                dot={false}
                                activeDot={{ r: 8 }}
                                name="Tỷ lệ tăng giảm rác báo cáo"
                            />
                            {/* Đường tỷ lệ tăng giảm cho rác thu gom */}
                            <Line
                                type="monotone"
                                dataKey="collectRate"
                                data={monthlyAmounts.map((item, index) => ({
                                    month: item.month,
                                    collectRate: collectRates[index],
                                }))}
                                stroke="#ef4444"
                                dot={false}
                                activeDot={{ r: 8 }}
                                name="Tỷ lệ tăng giảm rác thu gom"
                            />
                        </BarChart>
                    </ChartContainer>
                </div>
            </div>

            {/* Phần nút với khoảng cách */}
            <div className="flex justify-center gap-4 mb-10">
                <button
                    onClick={() => setYear(year - 1)}
                    className="px-4 py-2 bg-green-500 text-white rounded-lg shadow hover:bg-green-600"
                >
                    Năm trước
                </button>
                <button
                    onClick={() => setYear(year + 1)}
                    className="px-4 py-2 bg-green-500 text-white rounded-lg shadow hover:bg-green-600"
                >
                    Năm sau
                </button>
            </div>

            <div className="bg-green-100 p-4 rounded-lg text-center">
                <h2 className="text-lg font-semibold text-gray-700">
                    Tổng khối lượng rác báo cáo trong năm
                </h2>
                <p className="text-xl font-bold text-green-600">{`${sumYear} kg`}</p>
            </div>
        </div>
    );
}
