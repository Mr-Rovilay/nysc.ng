import axios from "axios";

// Define the base URL for the API from environment variables
const baseURL = "http://localhost:4000";

// Create an Axios instance for public requests
export const publicRequest = axios.create({
  baseURL,
});

// Create an Axios instance for user requests with an authorization token
export const userRequest = axios.create({
  baseURL,
});

// Adding an interceptor to dynamically set the Authorization header
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

// Optional: Add a response interceptor to handle token expiry or other errors
userRequest.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (error.response && error.response.status === 401) {
      // Handle unauthorized error, e.g., redirect to login page
      console.error("Unauthorized, redirecting to login...");
      // Clear the token from localStorage if needed
      localStorage.removeItem("token");
      // Redirect to login page or perform other actions
    }
    return Promise.reject(error);
  }
);

// Public request example
// publicRequest
//   .get("/some-public-endpoint")
//   .then((response) => {
//     console.log(response.data);
//   })
//   .catch((error) => {
//     console.error(error);
//   });

// // User request example
// userRequest
//   .get("/some-protected-endpoint")
//   .then((response) => {
//     console.log(response.data);
//   })
//   .catch((error) => {
//     console.error(error);
//   });
