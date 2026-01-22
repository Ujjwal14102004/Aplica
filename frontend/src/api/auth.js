import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  withCredentials: true, // 🔥 REQUIRED for cookies
});

export const getMe = async () => {
  const res = await api.get("/auth/me");
  return res.data;
};
