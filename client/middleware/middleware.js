import axios from "axios";

const baseURL = import.meta.env.VITE_SERVER_DOMAIN;

export const publicRequest = axios.create({
  baseURL,
});

export const userRequest = axios.create({
  baseURL,
});
console.log(baseURL);

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
