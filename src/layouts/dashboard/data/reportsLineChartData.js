// fetchLineChartData.js
import apiClient from "api/apiClient";

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

const fetchLineChartData = async (year) => {
  try {
    if (!year) throw new Error("Invalid year parameter");

    const response = await apiClient.get("/api/v1/statistical/getRegistrationStats/monthly", {
      params: { year },
    });

    const apiData = response.data.data;

    if (!apiData || typeof apiData !== "object") {
      throw new Error("Invalid API response structure");
    }

    const data = months.map((_, index) => {
      const monthKey = `Month ${index + 1}`;
      const monthData = apiData[monthKey];
      return monthData !== undefined ? monthData : 0;
    });

    return {
      labels: months,
      datasets: {
        label: "User",
        data,
      },
    };
  } catch (error) {
    console.error("Error fetching line chart data:", error.message);
    return {
      labels: months,
      datasets: {
        label: "User",
        data: Array(12).fill(0),
      },
    };
  }
};

export default fetchLineChartData;
