import CustomerReport from '@/components/customer/customer-report';
import ProductReport from '@/components/product/product-report';
import { differenceInSeconds, endOfMonth } from 'date-fns';

// Có nhiều mức độ cache dữ liệu
// Cache dữ liệu sử dụng fetch api -> chỉ cache data nên nếu code xử lý ở các component
// con bên dưới phức tạp thì phải bắt buộc sử dụng useMemo hoặc useCallback để tránh việc re-render

// Cache entry file -> sử dụng 'use cache' để cache dữ liệu ở entry file
// Đồng thời sử dụng thêm revalidate để revalidate dữ liệu sau mỗi khoảng thời gian nhất định 

const QuestionOne = async () => {

  // Gọi api load dữ liệu từ file json
  const reportsRes = await fetch('http://localhost:3000/api/load-file', 
  { 
    method: 'GET',
    // force-cache để bật cache
    // Hạn chế việc fetch dữ liệu nhiều lần
    cache: 'force-cache',
    next: {
      // Do dữ liệu phân tích là những tháng trước nên sẽ revalidate 1 lần vào cuối tháng
      revalidate: differenceInSeconds(endOfMonth(new Date()), new Date())
    },
  });
  const reports = await reportsRes.json();

  return (
      <div className='flex items-center gap-10'>
        <div className='basis-1/2 flex-shrink-0'>
          <CustomerReport data={reports?.customers} />
        </div>
        <div className='flex-grow'>
          <ProductReport data={reports?.products} />
        </div>
      </div>
  );
};

export default QuestionOne;