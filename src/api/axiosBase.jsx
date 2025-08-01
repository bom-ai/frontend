// src/api/axiosBase.js
import axios from "axios";

const axiosBase = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || "/api",
  headers: { "Content-Type": "application/json" },
});

export default axiosBase;
