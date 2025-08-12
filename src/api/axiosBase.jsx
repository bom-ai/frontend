// src/api/axiosBase.js
import axios from "axios";

const axiosBase = axios.create({
  baseURL: "https://bomatic-test-m5gnp76nfq-du.a.run.app/api",
  headers: { "Content-Type": "application/json" },
});

export default axiosBase;
