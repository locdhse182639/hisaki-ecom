import axios from "axios";

const useLocal = process.env.NODE_ENV === "development";

const axiosInstance = axios.create({
  baseURL: useLocal
    ? "http://localhost:5000/api" /* process.env.LOCAL_API_URL*/
    : process.env.NEXT_PUBLIC_API_URL,
  timeout: 10000,
});

axiosInstance.interceptors.request.use(
  (config) => {
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// axiosInstance.interceptors.response.use(
//   (response) => {
//     console.log("Interceptor Response:", response);
//     return response.data; // Ensure we always return response.data
//   },
//   (error) => {
//     console.error("Axios error:", error.response || error.message);
//     return Promise.reject(error);
//   }
// );
export default axiosInstance;
