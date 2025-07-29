import axios from "axios";
import { store } from "../redux/store";

const axiosPrivate = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  withCredentials: true,
});

axiosPrivate.interceptors.request.use(
  (config) => {
    const token = store.getState().auth.accessToken;

    if (token && !config.headers["Authorization"]) {
      config.headers["Authorization"] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);
export default axiosPrivate;
