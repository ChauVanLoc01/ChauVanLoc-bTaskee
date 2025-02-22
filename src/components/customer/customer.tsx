'use client';

import { useInfiniteQuery, useQuery } from '@tanstack/react-query';
import { useSearchParams } from 'next/navigation';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '../ui/card';
import {
  TableCell,
  TableHead
} from '../ui/table';

// Virtualize list dành riêng cho table
// Giải quyết vấn đề render một lượng lớn dữ liệu
// Chỉ render/paint những phần cần thiết
import Link from 'next/link';
import { TableVirtuoso } from 'react-virtuoso';

const Customer = () => {
  const searchParams = useSearchParams();
  const sort = searchParams.get('sort') || 'desc';
  const page = searchParams.get('page') || 1;
  const limit = searchParams.get('limit') || 10;

  // Sử dụng useQuery để fetch dữ liệu
  // useQuery sẽ tự động quản lý việc fetch dữ liệu, cache dữ liệu
  // Khi dữ liệu thay đổi thì component sẽ tự động re-render
  // Tối ưu việc fetch dữ liệu
  // Trong thực tế sẽ không trả ra số lượng lớn dữ liệu như vậy mà sẽ phân trang
  // Case này giải quyết cho việc phân trang
  const customerQuery = useQuery({
    // query key sẽ được sử dụng để xác định dữ liệu cần fetch
    // khi nhấn sort, phân trang thì query key sẽ thay đổi -> dữ liệu sẽ được fetch lại tự động
    queryKey: ['customer', { sort, page, limit }],
    queryFn: async () => {
      return fetch(`http://localhost:3000/api/customer?${searchParams}`).then(
        (res) => res.json()
      );
    },
    placeholderData: (old) => old,
    // Stale time là 10s
    // Thời gian này sẽ được sử dụng để xác định liệu dữ liệu có cần được fetch lại hay không
    // Trong vòng 10s nếu có request thì dữ liệu sẽ được lấy từ memory cache
    // Sau 10s nếu có request thì dữ liệu sẽ được fetch lại
    // Tùy theo nghiệp vụ mà có thể set time này cho hợp lý
    staleTime: 1000 * 10,
  });

  // Case này cũng giải quyết cho việc phân trang nhưng theo dạng lazy load
  // Load từng trang dữ liệu khi người dùng cuộn đến cuối trang
  // Sử dụng useInfiniteQuery
  // Tương tự như useQuery nhưng sẽ có thêm các hàm phục vụ cho việc tự động tải thêm dữ liệu theo trang
  // Nếu sử dụng lazy load(infinity query) thì cần phải virtualize list, chỉ paint/render những gì cần thiết
  const infinityData = useInfiniteQuery({
    queryKey: ['customers_infinite', sort],
    queryFn: async () => {
      return fetch(`http://localhost:3000/api/customer`).then(
        (res) => res.json()
      );
    },
    initialPageParam: 0,
    getNextPageParam: (lastPage, pages) => lastPage.nextCursor,
    getPreviousPageParam: (firstPage, pages) => firstPage.prevCursor,
    // Cần phải set maxPages để tránh trường hợp lặp vô hạn
    // thường sẽ cần call api để lây số lượng trang
    maxPages: 3,
  });

  return (
    <Card className='flex flex-col'>
      <CardHeader className='items-center pb-0'>
        <CardTitle>Danh sách KH</CardTitle>
        <CardDescription>
          Danh sách KH sắp xếp theo tổng chi tiêu
        </CardDescription>
      </CardHeader>
      <CardContent>
        <TableVirtuoso
          style={{ height: 200, width: '100%' }}
          data={customerQuery?.data?.dummyData}
          fixedHeaderContent={() => (
            <tr className='bg-gray-100'>
              <TableHead>Khách hàng</TableHead>
              <TableHead className='flex items-center gap-2'>
                Chi tiêu
                <Link 
                  href={`${window.location.pathname}?sort=${sort === 'asc' ? 'desc' : 'asc'}`} 
                  className='outline-none border-none'
                >
                  <svg
                    xmlns='http://www.w3.org/2000/svg'
                    fill='none'
                    viewBox='0 0 24 24'
                    strokeWidth='1.5'
                    stroke='currentColor'
                    className='size-4'
                  >
                    <path
                      strokeLinecap='round'
                      strokeLinejoin='round'
                      d='M3 7.5 7.5 3m0 0L12 7.5M7.5 3v13.5m13.5 0L16.5 21m0 0L12 16.5m4.5 4.5V7.5'
                    />
                  </svg>
                </Link>
              </TableHead>
            </tr>
          )}
          components={{
            Table: ({ children }) => (
              <table className='w-full'>{children}</table>
            ),
          }}
          itemContent={(_, record) => (
            <>
              <TableCell>{record.customer_name}</TableCell>
              <TableCell>{record.total_price}</TableCell>
            </>
          )}
          // Cuộn đến cuối trang thì sẽ fetch thêm dữ liệu nếu còn
          endReached={() => infinityData.fetchNextPage()}
        />
      </CardContent>
    </Card>
  );
};

export default Customer;
