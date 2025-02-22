'use client';

import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from '@/components/ui/chart';
import { Bar, BarChart, CartesianGrid, XAxis } from 'recharts';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '../ui/card';
import { useMemo } from 'react';

const ramdomColor = [
  '#3A7FBC',
  '#E2B45A',
  '#9C4F8D',
  '#F0C12D',
  '#2B8D3F',
  '#5C1DAB',
  '#D4F79C',
  '#FF5733',
  '#8D44AD',
  '#3498DB',
];

type Props = {
  data: Record<
    string,
    Record<
      string,
      {
        id: string;
        quantity: number;
      }
    >
  >;
};

const ProductReport = (props: Props) => {
  const { data } = props;

  const { chartConfig, chartData } = useMemo(() => {
    const chartData: any[] = [];
    let products: Record<string, string | number> = {};

    for (let key in data) {
      let items = Object.values(data[key])
        .sort((a, b) => b.quantity - a.quantity)
        .slice(0, 5);

      let itemByKey = items.reduce<Record<string, number>>((acc, item) => {
        acc[item.id] = item.quantity;
        return acc;
      }, {});

      products = { ...products, ...itemByKey };

      chartData.push({
        date: key,
        ...itemByKey,
      });
    }

    const chartConfig: any = {};

    let i = 0;
    for (let itemName in products) {
      chartConfig[itemName] = { label: itemName, color: ramdomColor[i] };
      i++;
    }

    return { chartConfig, chartData };
  }, [data]);

  return (
    <Card className='flex flex-col'>
      <CardHeader className='items-center pb-0'>
        <CardTitle>Top sản phẩm</CardTitle>
        <CardDescription>
          Top 5 sản phẩm được mua nhiều nhất trong 3 tháng gần nhất
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer
          config={chartConfig}
          className='min-h-[200px] w-full'
        >
          <BarChart
            accessibilityLayer
            data={chartData}
          >
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey='date'
              tickLine={false}
              tickMargin={10}
              axisLine={false}
            />
            <ChartTooltip content={<ChartTooltipContent />} />
            {Object.keys(chartConfig).map((key) => (
              <Bar
                key={key}
                dataKey={key}
                fill={`var(--color-${key})`}
                radius={4}
              />
            ))}
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
};

export default ProductReport;
