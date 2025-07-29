import axiosBase from "./axiosBase";

export const login = async (email, password) => {
  const response = await axiosBase.post("/auth/login", { email, password });
  return response.data;
};

export const register = async (email, password) => {
  const response = await axiosBase.post("/auth/register", { email, password });
  return response.data;
};

export const logout = () => {
  localStorage.clear();
  window.location.href = "/";
};
