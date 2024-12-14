// fetchBarChartData.js
import apiClient from "api/apiClient";

// Danh sách nhãn cố định cho 12 tháng
export const months = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
];

// Hàm lấy dữ liệu biểu đồ cột
const fetchBarChartData = async (year) => {
  try {
    if (!year) throw new Error("Invalid year parameter");
    const response = await apiClient.get("/api/v1/enrollment/revenue/statistics", {
      params: { year },
    });

    const apiData = response.data.data;
    // console.log("API revenue/statistics:", response.data);

    if (!apiData || typeof apiData !== "object") {
      throw new Error("Invalid API response structure");
    }

    // Ánh xạ dữ liệu theo thứ tự tháng 1 -> tháng 12
    const data = months.map((_, index) => {
      const monthKey = `Month ${index + 1}`; // Key của tháng
      const monthData = apiData[monthKey]; // Lấy giá trị từ API
      // console.log(monthKey, monthData); // Debug log
      return monthData !== undefined ? monthData : 0; // Gán 0 nếu không có giá trị
    });

    return {
      labels: months,
      datasets: {
        label: `Revenue (${year})`,
        data: data,
      },
    };
  } catch (error) {
    console.error("Error fetching bar chart data:", error.message);
    return {
      labels: months,
      datasets: {
        label: `Revenue (${year})`,
        data: Array(12).fill(0),
      },
    };
  }
};

export default fetchBarChartData;
