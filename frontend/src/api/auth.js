import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  withCredentials: true, // 🔥 REQUIRED for cookies
});

export const getMe = async () => {
  const res = await fetch(`${API_BASE_URL}/api/auth/me`, {
    credentials: "include"
  });

  if (!res.ok) {
    throw new Error("Unauthorized");
  }

  const data = await res.json();
  return data.user;
};
