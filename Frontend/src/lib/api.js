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

axios.defaults.withCredentials = true;

const api = axios.create({
  baseURL: "https://insta-food-1.onrender.com",
  withCredentials: true,
});

export default api;
