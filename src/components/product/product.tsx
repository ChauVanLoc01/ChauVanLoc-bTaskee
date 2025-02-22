
'use client'

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from "@/components/ui/card"
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart"
import { useQuery } from "@tanstack/react-query"
import { useMemo } from "react"
import { Pie, PieChart } from "recharts"

const colors = [
  "#FF5733",
  "#33FF57",
  "#3357FF",
  "#FF33A1",
  "#33FFA1",
  "#A133FF",
  "#FFB833",
  "#33B8FF",
  "#A1FF33",
  "#FF3333"
]

type Props = {}

const Product = (props: Props) => {

  const topProduct = useQuery({
    queryKey: ["products"],
    queryFn: async () => {
      return fetch(`http://localhost:3000/api/product`).then((res) => res.json())
    },
    select: res => {
      return res?.dummyData?.map((item: any, index: number) => ({ ...item, fill: colors[index] }))
    },
    placeholderData: old => old,
    staleTime: 1000 * 10,
    // Tự động refetch dữ liệu sau 10s
    refetchInterval: 1000 * 10,
  })

  console.log(topProduct?.data);

  const chartConfig = useMemo(() => {
    let config: ChartConfig = {}
    topProduct?.data?.forEach((item: any) => {
      config[item.id] = { label: item.name, color: item.fill }
    })
    return config
  }, [topProduct?.data])

  return (
    <Card className="flex flex-col">
      <CardHeader className="items-center pb-0">
        <CardTitle>Top 10 sản phẩm</CardTitle>
        <CardDescription>Top 10 sản phẩm bán chạy nhất</CardDescription>
      </CardHeader>
      <CardContent className="flex-1 pb-0">
        <ChartContainer
          config={chartConfig}
          className="mx-auto aspect-square max-h-[250px]"
        >
          <PieChart>
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent hideLabel />}
            />
            <Pie
              data={topProduct?.data}
              dataKey="sales"
              nameKey="name"
              innerRadius={60}
              strokeWidth={5}
            />
          </PieChart>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}

export default Product