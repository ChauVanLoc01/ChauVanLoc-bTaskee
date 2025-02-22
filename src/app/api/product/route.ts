import dummyData from './data.json';

export async function GET(request: Request) {

    // Câu lệnh orm để query dữ liệu
    // Nhóm theo productId và tính tổng quantity
    // Mặc định sắp xếp theo tổng quantity
    // Lấy 10 sản phẩm có số lượng bán nhiều nhất
    // return prisma?.orderItem?.groupBy({
    //     by: ['productId'],
    //     _count: {
    //         quantity: true,
    //     },
    //     orderBy: {
    //         _count: {
    //             quantity: 'desc'
    //         }
    //     },
    //     take: 10
    // })

  await new Promise((resolve) => setTimeout(resolve, 1000));
  // Giả lập dữ liệu trả về
  return Response.json({ dummyData });
}
