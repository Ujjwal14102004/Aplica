import axios from "axios";

console.log("API BASE URL:", import.meta.env.VITE_API_BASE_URL);

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  withCredentials: true, // 🔥 cookies
});

export const getMe = async () => {
  const res = await api.get("/auth/me");
  return res.data;
};
