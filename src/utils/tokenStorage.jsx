export const setTokens = ({ accessToken, refreshToken, expiresIn }) => {
  localStorage.setItem("accessToken", accessToken);
  localStorage.setItem("refreshToken", refreshToken);
  localStorage.setItem("expiresAt", Date.now() + expiresIn * 1000); // milliseconds
};

export const getAccessToken = () => localStorage.getItem("accessToken");
export const getRefreshToken = () => localStorage.getItem("refreshToken");

export const isTokenExpired = () => {
  const expiresAt = localStorage.getItem("expiresAt");
  return Date.now() > parseInt(expiresAt || "0", 10);
};
