// src/api/axiosBase.js
import axios from "axios";

const axiosBase = axios.create({
  baseURL: "http://34.60.203.231:8000/api",
  headers: { "Content-Type": "application/json" },
});

export default axiosBase;
