import axios from "axios";

const baseURL = "http://localhost:4000";

export const publicRequest = axios.create({
  baseURL,
});

export const userRequest = axios.create({
  baseURL,
});

userRequest.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);
