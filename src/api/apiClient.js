import axios from "axios";

const apiClient = axios.create({
  // Call API Server
  // baseURL: "https://stardev.online/api",

  // Call API Local
  baseURL: "http://localhost:3030",

  headers: {
    "Content-Type": "application/json",
  },
});

export default apiClient;
