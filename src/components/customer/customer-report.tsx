import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '../ui/card';

type Props = {
  data: Record<string, { id: string; total: number }>;
};

const CustomerReport = (props: Props) => {
  const { data } = props;

  const convertData = Object.values(data);

  return (
    <Card className='flex flex-col'>
      <CardHeader className='items-center pb-0'>
        <CardTitle>Top 10 KH</CardTitle>
        <CardDescription>
          Top 10 KH có giá trị đơn hàng lớn nhất trong tháng trước
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Customer</TableHead>
              <TableHead className='text-right'>Max</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {convertData
              ?.sort((a, b) => b.total - a.total)
              ?.slice(0, Math.min(convertData.length, 10))
              ?.map((order) => (
                <TableRow key={order.id}>
                  <TableCell>{order.id}</TableCell>
                  <TableCell className='text-right'>{order.total}</TableCell>
                </TableRow>
              ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
};

export default CustomerReport;
