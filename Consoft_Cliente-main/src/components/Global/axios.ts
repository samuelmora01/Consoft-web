import axios from "axios";

const baseURL =
  process.env.NEXT_PUBLIC_API_BASE_URL ||
  (process.env.NODE_ENV === "production"
    ? "https://consoft-api.onrender.com"
    : "http://localhost:3001");

const api = axios.create({
  baseURL,
  withCredentials: true,
});

export default api;