// import axios from "axios";

// const baseURL =
//   import.meta.env.VITE_API_BASE_URL ||
//   (import.meta.env.DEV ? "http://localhost:3000" : "");

// const api = axios.create({
//   baseURL,
//   withCredentials: true,
// });

// export default api;

import axios from "axios";

const api = axios.create({
  baseURL: "https://insta-food-1.onrender.com",
  withCredentials: true, // 🔥 MOST IMPORTANT
});

// Add request interceptor to include Authorization header
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  },
);

export default api;
