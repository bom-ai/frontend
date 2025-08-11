// src/api/axiosSecure.js
import axios from "axios";
import {
  getAccessToken,
  getRefreshToken,
  setTokens,
  isTokenExpired,
} from "../utils/tokenStorage";
import { logout } from "./auth";
import axiosBase from "./axiosBase";

const axiosSecure = axios.create({
  baseURL: "http://34.60.203.231:8000/api",
  headers: { "Content-Type": "application/json" },
});

const refreshAccessToken = async () => {
  const refreshToken = getRefreshToken();
  if (!refreshToken) throw new Error("No refresh token");

  const response = await axiosBase.post("/auth/refresh", { refreshToken });

  setTokens(response.data);
  return response.data.accessToken;
};

// 요청 인터셉터
axiosSecure.interceptors.request.use(
  async (config) => {
    let token = getAccessToken();

    if (isTokenExpired() && getRefreshToken()) {
      try {
        token = await refreshAccessToken();
      } catch (err) {
        console.error("🔒 토큰 갱신 실패, 로그아웃:", err);
        logout();
        return Promise.reject(err);
      }
    }

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => Promise.reject(error)
);

export default axiosSecure;
