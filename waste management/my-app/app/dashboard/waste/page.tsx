"use client"

import { Bar, BarChart, CartesianGrid, XAxis } from "recharts"

import {
    ChartConfig,
    ChartContainer,
    ChartTooltip,
    ChartTooltipContent,
} from "@/components/ui/chart"
import { useEffect, useState } from "react"
import { getAmountbyMoth, getAmountbyyear, getAmountWaste } from "@/utils/db/actions"
import { date } from "drizzle-orm/mysql-core"






export default function page() {
    const year = 2024
    const [amount1, setAmount1] = useState(0)
    const [amount2, setAmount2] = useState(0)
    const [amount3, setAmount3] = useState(0)
    const [amount4, setAmount4] = useState(0)
    const [amount5, setAmount5] = useState(0)
    const [amount6, setAmount6] = useState(0)
    const [amount7, setAmount7] = useState(0)
    const [amount8, setAmount8] = useState(0)
    const [amount9, setAmount9] = useState(0)
    const [amount10, setAmount10] = useState(0)
    const [amount11, setAmount11] = useState(0)
    const [amount12, setAmount12] = useState(0)
    const [sumYear, setSumYear] = useState(0)



    const chartData = [
        { month: "Tháng 1", report: amount1 },
        { month: "Tháng 2", report: amount2 },
        { month: "Tháng 3", report: amount3 },
        { month: "Tháng 4", report: amount4 },
        { month: "Tháng 5", report: amount5 },
        { month: "Tháng 6", report: amount6 },
        { month: "Tháng 7", report: amount7 },
        { month: "Tháng 8", report: amount8 },
        { month: "Tháng 9", report: amount9 },
        { month: "Tháng 10", report: amount10 },
        { month: "Tháng 11", report: amount11 },
        { month: "Tháng 12", report: amount12 },


    ]
    const chartConfig = {
        report: {
            label: "Số lượng rác",
            color: "#2563eb",
        }
    } satisfies ChartConfig
    const getAmountForMonth = async (month: string) => {
        const getWaste = await getAmountbyMoth(`2024-${month}`)
        const sum = getWaste?.reduce((init, amoun) => {
            const amount = parseInt(amoun.amount)
            return init + amount
        }, 0)

        return sum
    }
    const getAmountForYear = async (year: string) => {
        const getWaste = await getAmountbyyear(year)
        console.log('year',getWaste);
        
        const sum = getWaste?.reduce((init, amoun) => {
            const amount = parseInt(amoun.amount)
            return init + amount
        }, 0)

        return sum
    }
    useEffect(() => {
        const fetchGetAmountWaste = async () => {
            try {

                setAmount1(await getAmountForMonth('01') as any)
                setAmount2(await getAmountForMonth('02') as any)
                setAmount3(await getAmountForMonth('03') as any)
                setAmount4(await getAmountForMonth('04') as any)
                setAmount5(await getAmountForMonth('05') as any)
                setAmount6(await getAmountForMonth('06') as any)
                setAmount7(await getAmountForMonth('07') as any)
                setAmount8(await getAmountForMonth('08') as any)
                setAmount9(await getAmountForMonth('09') as any)
                setAmount10(await getAmountForMonth('10') as any)
                setAmount11(await getAmountForMonth('11') as any)
                setAmount12(await getAmountForMonth('12') as any)
                setSumYear(await getAmountForYear(year.toString()) as any )





            } catch (error) {
                console.error('loi get rac', error);

            }
        }
        fetchGetAmountWaste()
    }, [])
    return (
        <div>
        <h1>{year}</h1>
            <ChartContainer config={chartConfig} className="min-h-[200px] w-full">
                <BarChart accessibilityLayer data={chartData}>
                    <CartesianGrid vertical={false} />
                    <XAxis
                        dataKey="month"
                        tickLine={false}
                        tickMargin={10}
                        axisLine={false}
                        tickFormatter={(value) => value.slice(0, 8)}
                    />
                    <ChartTooltip content={<ChartTooltipContent />} />
                    <Bar dataKey="report" fill="var(--color-report)" radius={4} />
                    <Bar dataKey="report" fill="var(--color-report)" radius={4} />
                   
                </BarChart>
            </ChartContainer>
            <h1>tổng khối lượng rác 1 năm : </h1>
            <h1>{`${sumYear}kg`}</h1>
        </div>
    )
}
