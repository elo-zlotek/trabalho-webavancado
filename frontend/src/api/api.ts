import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:5007",
  headers: {
    "Content-Type": "application/json",
  },
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

api.interceptors.response.use(
    (response) => response,

    (error) => {

        if (
            error.response?.status === 401 &&
            window.location.pathname !== "/login"
        ) {
            localStorage.removeItem("token");
            localStorage.removeItem("usuario");
            localStorage.removeItem("nome");
            localStorage.removeItem("usuarioId");
            localStorage.removeItem("usuarioSetorId");
            window.location.href = "/login";
        }

        return Promise.reject(error);
    }
);
export default api;

