import apiClient from "api/apiClient";

// Lấy người dùng ngày hôm nay
export const fetchTodayUsers = async () => {
  try {
    const response = await apiClient.get("/api/v1/statistical/getRegistrationStats/daily");
    const today = new Date();
    const todayData = response.data.data.filter((entry) => {
      const entryDate = new Date(entry.year, entry.month - 1, entry.day);
      return entryDate.toDateString() === today.toDateString();
    });
    return todayData.length ? todayData : 0;
  } catch (error) {
    console.error("Lỗi khi lấy dữ liệu người dùng hôm nay:", error);
    return 0;
  }
};

// Lấy tất cả người dùng
export const fetchAllUsers = async () => {
  try {
    const response = await apiClient.get("/api/v1/statistical/getTotalUsers");
    // console.log("fetchAllUsers: ", response.data.data);
    return response.data.data;
  } catch (error) {
    console.error("Error fetching enrollments:", error.response?.data || error.message);
    throw error;
  }
};

// Lấy tổng doanh thu ngày hôm nay
export const fetchTodayRevenue = async () => {
  try {
    const response = await apiClient.get("/api/v1/statistical/revenue/today");
    // console.log("Today's Revenue: ", response.data.data);
    return response.data.data;
  } catch (error) {
    console.error("Error fetching today's revenue:", error.response?.data || error.message);
    throw error;
  }
};

// Lấy tổng doanh thu theo năm
export const fetchTotalRevenue = async (year) => {
  try {
    const response = await apiClient.get(`/api/v1/statistical/revenue/total?year=${year}`);
    // console.log("Total Revenue: ", response.data.data);
    return response.data.data;
  } catch (error) {
    console.error("Error fetching total revenue:", error.response?.data || error.message);
    throw error;
  }
};
