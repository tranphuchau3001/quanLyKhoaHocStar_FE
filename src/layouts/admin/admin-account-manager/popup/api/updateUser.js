import apiClient from "api/apiClient";

export const updateUser = async (userData) => {
  try {
    const response = await apiClient.put("/user-api/update", userData, {
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
