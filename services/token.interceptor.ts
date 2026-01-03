import axios from "axios";
import { API_BASE_URL } from "@/config";
import { getAuthHandlers } from "./authServices";

// Crear instancia de Axios
const api = axios.create({
  baseURL: API_BASE_URL,
});

// Interceptor para agregar el token automáticamente en cada petición
api.interceptors.request.use(
  (config) => {
    const tokenData = localStorage.getItem("token");
    const token = tokenData ? JSON.parse(tokenData).access_token : null;

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  },
);

api.interceptors.response.use(
  (response) => {
    if (response.data?.access_token) {
      getAuthHandlers().login(response.data);
    }
    return response;
  },
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem("token");
      getAuthHandlers().logout();

      window.location.href = window.location.origin + "/";
    }
    return Promise.reject(error);
  },
);

export default api;
