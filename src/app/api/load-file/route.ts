import { DATE_FORMAT } from '@/lib/date.format';
import { OrderExpand } from '@/types/order';
import { eachMonthOfInterval, format, startOfMonth, sub } from 'date-fns';
import fs from 'fs';
import path from 'path';
import { pipeline } from 'stream';
// Sử dụng stream-json để xử lý file JSON lớn
import StreamArray from 'stream-json/streamers/StreamArray';
import { promisify } from 'util';

const pipelineAsync = promisify(pipeline);

const pathToDataJson = 'src/app/api/load-file/data.json';

export const fetchingReport = async () => {
  const dateOfInterval = eachMonthOfInterval({
    start: sub(new Date(), { months: 1 }),
    end: sub(new Date(), { months: 3 }),
  });
  const monthRecent = format(dateOfInterval[0], DATE_FORMAT.COMMON);
  const fiveMonthRecent = dateOfInterval.reduce<Record<string, Date>>(
    (acc, date) => {
      acc[format(date, DATE_FORMAT.COMMON)] = date;
      return acc;
    },
    {}
  );

  // Dùng object để lưu trữ dữ liệu của customers và products
  // Truy xuất nhanh O(1)
  // Tập hợp customer theo id
  // { [customerId]: { id: string, total: number } }
  const customers: Record<string, { id: string; total: number }> = {};
  // Vì cần hiển thị sản phẩm theo tháng nên phải map theo tháng
  // và mỗi tháng sẽ có danh sách sản phẩm theo id
  // loop qua từng đơn hàng sẽ có order_date và itemId nên sử dụng
  // { [order_date]: { [productId]: { id: string, quantity: number } } }
  const products: Record<string, Record<string, { id: string; quantity: number }>> = {};

  const ordersFilePath = path.join(process.cwd(), pathToDataJson);
  // Tạo stream đọc file
  const fileStream = fs.createReadStream(ordersFilePath);
  // Sử dụng StreamArray để xử lý các phần tử của mảng JSON
  const jsonStream = StreamArray.withParser();

  // Sử dụng pipeline để kết hợp các stream và xử lý theo batch
  await pipelineAsync(
    fileStream,
    jsonStream,
    async function (
      source: AsyncIterable<{ key: number; value: OrderExpand }>
    ) {
      for await (const record of source) {
        let order = record.value;
        let orderDate = format(startOfMonth(order.order_date), DATE_FORMAT.COMMON);

        // Lọc ra các đơn hàng trong tháng gần nhất
        if (monthRecent === orderDate) {
          let customerId = order.customer_id;
          customers[customerId] = customers[customerId] || { id: order.customer_id, total: 0 };
          customers[customerId].total = Math.max(customers?.[customerId]?.total || 0, order.total_price);
        }

        // Lọc ra các đơn hàng trong 3 tháng gần nhất
        if (fiveMonthRecent?.[orderDate]) {
          order?.items?.forEach((item) => {
            let productId = item.product_id;

            // check tồn tại orderDate chưa -> nếu chưa thì tạo mới {}
            products[orderDate] = products[orderDate] || {};

            // check tồn tại productId chưa -> nếu chưa thì tạo mới { quantity: 0, id: item.product_id }
            products[orderDate][productId] = products[orderDate][productId] || { quantity: 0, id: item.product_id };

            // cộng dồn số lượng sản phẩm
            products[orderDate][productId].quantity += item.quantity;
          });
        }
      }
    }
  );

  return { customers, products };
};

export async function GET(request: Request) {
    // wait 1s để giả lập việc fetch dữ liệu từ database
    // phía FE sẽ hanlde suspend và loading
    await new Promise((resolve) => setTimeout(resolve, 1000));

    // fetch dữ liệu từ file data.json
    const reports = await fetchingReport();

    return Response.json(reports);
}