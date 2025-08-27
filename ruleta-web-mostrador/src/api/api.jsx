import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:8000",
  withCredentials: false,
});

api.interceptors.response.use(
  response => response,
  error => {
    console.error("❌ Error en la petición:", error.response || error.message);
    return Promise.reject(error);
  }
);

export default api;
