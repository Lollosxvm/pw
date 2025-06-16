import axios from "axios";

export const axiosPrivate = axios.create({
  baseURL: "http://localhost:3000/api",
});

axiosPrivate.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default axiosPrivate;
