import axios from "axios";

const axiosClient = axios.create({
  baseURL: "http://localhost:5000/api", // Update with your backend URL
  headers: {
    "Content-Type": "application/json",
  },
});

axiosClient.interceptors.request.use((config) => {
  const token = localStorage.getItem("adminToken");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default axiosClient; // Use this for all backend requests
