import apiClient from "api/apiClient";

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

export const fetchAllUsers = async () => {
  try {
    const response = await apiClient.get("/api/v1/statistical/getTotalUsers");
    console.log("fetchAllUsers: ", response.data.data);
    return response.data.data;
  } catch (error) {
    console.error("Error fetching enrollments:", error.response?.data || error.message);
    throw error;
  }
};
