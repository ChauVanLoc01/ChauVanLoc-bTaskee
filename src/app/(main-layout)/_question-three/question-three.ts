// Thuật toán này người ta thường gọi là cửa sổ trượt (Sliding Window)
// Đây là một thuật toán rất phổ biến trong việc giải quyết các bài toán liên quan đến mảng
// Nhưng nếu muốn thực hiện thì bắt buộc mảng phải được sắp xếp trước
// B1 là nhóm các khách hàng theo tổng giá trị đơn hàng O(m)
// B2 chuyển đổi object thành mảng và sắp xếp mảng theo tổng giá trị đơn hàng O(n log n)
// B3 là loop qua từng khách hàng, và đứng ở vị trí khách hàng đó lướt lần lượt 1-2 index (tương đương nhóm 2-3 người) O(n)
// dùng biến ghi nhớ lại nhóm tốt nhất, và cập nhật khi tìm thấy nhóm tốt hơn
// 2 nhóm cùng tốt thì lưu cả 2
// Độ phức tạp của thuật toán này là O(n + n log n)

// Nếu dữ liệu lớn lên đến hàng triệu hàng tỷ thì có thể cân nhắc chunking dữ liệu thành các package nhỏ
// Sử dụng Web Workers để xử lý song song trên FE
// Hoặc xử lý ở BE bằng Worker Threads
// Sử dụng cache để lưu kết quả đã tính toán trước đó
// Sử dụng database để lưu trữ và xử lý dữ liệu lớn

function findClosestGroups(orders: any) {
  // Bước 1: Tính tổng giá trị đơn hàng cho từng khách hàng
  const customerTotals: Record<string, number> = {};
  for (const order of orders) {
    const cid = order.customer_id;
    customerTotals[cid] = (customerTotals[cid] || 0) + order.total_price;
  }

  // Chuyển đổi thành mảng và sắp xếp
  const customers: any[] = [];
  for (let customer_id in customerTotals) {
    customers.push({ customer_id, total: customerTotals[customer_id] });
  }
  customers.sort((a, b) => a.total - b.total);

  let minDiff = Infinity;
  let bestGroups: any[] = [];
  let maxGroupLength = 0;

  // Bước 2: Duyệt từng nhóm 2-3 phần tử liên tiếp
  // Vì gọi là nhóm nên phải bắt đầu từ 2 phần tử
  for (let i = 0; i < customers.length; i++) {
    for (let k = 1; k < 3; k++) {
      const j = i + k;
      if (j >= customers.length) break;

      const currentGroup = customers.slice(i, j + 1);
    //   const totals = currentGroup.map((c) => c.total);
      const currentDiff = currentGroup[currentGroup.length - 1].total - currentGroup[0].total;
      const currentLength = currentGroup.length;

      // Cập nhật nhóm tốt nhất
      // Nếu có nhóm mới tốt hơn nhóm trước đó tạo nhóm mới
      if (currentDiff < minDiff) {
        minDiff = currentDiff;
        maxGroupLength = currentLength;
        bestGroups = [currentGroup];
      } else if (currentDiff === minDiff) {
        // Ưu tiên chọn nhóm có nhiều khách hàng hơn
        if (currentLength > maxGroupLength) {
          maxGroupLength = currentLength;
          bestGroups = [currentGroup];

          // Nếu có nhiều nhóm cùng số lượng khách hàng thì lưu hết
        } else if (currentLength === maxGroupLength) {
          bestGroups.push(currentGroup);
        }
      }
    }
  }

  return bestGroups;
}
