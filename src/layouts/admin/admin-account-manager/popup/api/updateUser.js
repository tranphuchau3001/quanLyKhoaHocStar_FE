import axios from "axios";

export const updateUser = async (userData) => {
  try {
    const response = await axios.put("http://localhost:3030/user-api/update", userData, {
      headers: {
        "Content-Type": "application/json",
      },
    });
    return response.data;
  } catch (error) {
    console.error("Lỗi khi cập nhật thông tin:", error);
    throw error;
  }
};
