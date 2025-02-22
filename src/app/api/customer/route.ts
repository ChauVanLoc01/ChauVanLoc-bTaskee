import dummyData from './data.json';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const sort = searchParams.get('sort');

  // Câu lệnh orm để query dữ liệu
  // Nhóm theo customerId và tính tổng totalPrice
  // Mặc định sắp xếp theo tổng totalPrice giảm dần
  // return prisma?.order?.groupBy({
  //     by: ['customerId'],
  //     _count: {
  //         totalPrice: true
  //     },
  //     orderBy: {
  //         _count: {
  //             totalPrice: 'desc'
  //         }
  //     }
  // })

  await new Promise((resolve) => setTimeout(resolve, 1000));
  // Em sẽ giả lập dữ liệu trả về để phía FE xử lý các yêu cầu tối ưu hóa
  return Response.json({
    dummyData: dummyData?.sort((a, b) => {
      if (sort === 'asc') {
        return a.total_price - b.total_price;
      } else {
        return b.total_price - a.total_price;
      }
    }),
  });
}
