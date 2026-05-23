import axios from "axios";

const authApi = axios.create({
  baseURL: "http://localhost:5001/api",
  withCredentials: true, // sends cookies (accessToken) for same-origin / CORS-credentialed requests
});

// Attach JWT from localStorage as Authorization header too.
// This is the key fix: cookies are blocked cross-origin in some browser configs,
// so we send the token both ways — cookie AND header. The middleware accepts either.
authApi.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("accessToken");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// 401 → clear token and redirect to login
authApi.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem("accessToken");
      window.location.href = "/login";
    }
    return Promise.reject(error);
  }
);

export default authApi;
