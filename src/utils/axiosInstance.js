import axios from "axios";

const axiosInstance = axios.create({
  baseURL: "https://api.01wire.com", // Set your base URL
  headers: {
    "Content-Type": "application/json",
    // Add other common headers if needed
  },
});

// Add an interceptor to include authorization token in every request
axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token"); // Assuming you store the token in localStorage
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default axiosInstance;
