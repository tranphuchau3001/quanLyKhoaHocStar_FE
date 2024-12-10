// Danh sách nhãn cố định cho 12 tháng
const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

const fetchBarChartData = async () => {
  try {
    const response = await apiClient.get("/api/v1/enrollment/revenue/statistics");

    const apiData = response.data;

    // Chuẩn hóa dữ liệu doanh thu, mặc định là 0 cho các tháng không có dữ liệu
    const data = months.map((_, index) => apiData[`Month ${index + 1}`] || 0);

    return {
      labels: months, // Nhãn là danh sách 12 tháng
      datasets: {
        label: "Revenue", // Nhãn cho biểu đồ
        data, // Dữ liệu doanh thu
      },
    };
  } catch (error) {
    console.error("Error fetching bar chart data:", error);
    return {
      labels: months,
      datasets: {
        label: "Revenue",
        data: Array(12).fill(0), // Mặc định giá trị cho 12 tháng là 0 nếu lỗi xảy ra
      },
    };
  }
};

export default fetchBarChartData;
