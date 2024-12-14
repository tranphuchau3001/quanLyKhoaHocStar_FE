import apiClient from "api/apiClient";

const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

const fetchReportsLineChartData = async () => {
  try {
    const response = await apiClient.get("/user-api/statistics");

    const apiData = response.data.data;
    const data = months.map((_, index) => apiData[`Month ${index + 1}`] || 0);
    // console.log("Data for chart:", response.data);
    return {
      labels: months, // Nhãn là danh sách 12 tháng
      datasets: {
        label: "User", // Nhãn cho biểu đồ
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

export default fetchReportsLineChartData;
