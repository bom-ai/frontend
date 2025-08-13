// src/api/axiosBase.js
import axios from "axios";

const axiosBase = axios.create({
  baseURL: "https://bomatic-server-ymu7mz7dqa-du.a.run.app/api",
  headers: { "Content-Type": "application/json" },
});

export default axiosBase;
