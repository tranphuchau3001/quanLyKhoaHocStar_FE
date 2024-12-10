import axios from "axios";

// Danh sách nhãn cố định cho 12 tháng
const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

// Hàm lấy dữ liệu biểu đồ cột
const fetchBarChartData = async (year) => {
  try {
    if (!year) throw new Error("Invalid year parameter");
    console.log("Năm", year);

    const response = await axios.get(`http://localhost:3030/api/v1/enrollment/revenue/statistics`, {
      params: { year },
    });

    const apiData = response.data;
    console.log("API Data:", apiData);

    const data = months.map((_, index) => {
      const monthKey = `Month ${index + 1}`; // Tạo key "Month 1", "Month 2", ...
      console.log(`Mapping Month ${index + 1}:`, apiData[monthKey] ?? 0);
      const monthData = apiData[monthKey]; // Lấy dữ liệu tháng từ API
      return monthData !== undefined ? monthData : 0; // Gán 0 nếu dữ liệu không tồn tại
    });

    return {
      labels: months,
      datasets: [
        {
          label: `Revenue (${year})`,
          data: data,
        },
      ],
    };
  } catch (error) {
    console.error("Error fetching bar chart data:", error.message);
    return {
      labels: months,
      datasets: [
        {
          label: `Revenue (${year})`,
          data: Array(12).fill(0), // Giá trị mặc định là 0 nếu có lỗi
        },
      ],
    };
  }
};

export default fetchBarChartData;
