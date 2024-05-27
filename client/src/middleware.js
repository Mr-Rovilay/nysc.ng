import axios from "axios";

// Define the base URL for the API
const url = "http://localhost:4000";

// Create an Axios instance for public requests
export const publicRequest = axios.create({
  baseURL: url,
});

// Create an Axios instance for user requests with an authorization token
export const userRequest = axios.create({
  baseURL: url,
});

// Adding an interceptor to dynamically set the Authorization header
userRequest.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token"); // Or any other method to get the token
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// import { userRequest } from './path/to/axiosSetup';

// const fetchUserData = async () => {
//   try {
//     const response = await userRequest.get('/private-endpoint');
//     console.log(response.data);
//   } catch (error) {
//     console.error('Error fetching user data:', error);
//   }
// };

// const loginUser = async (credentials) => {
//   try {
//     const response = await publicRequest.post('/auth/login', credentials);
//     const { token } = response.data;
//     localStorage.setItem('token', token); // Storing the token
//     console.log('Login successful');
//   } catch (error) {
//     console.error('Error logging in:', error);
//   }
// };

// import { publicRequest } from './path/to/axiosSetup';

// const fetchPublicData = async () => {
//   try {
//     const response = await publicRequest.get('/public-endpoint');
//     console.log(response.data);
//   } catch (error) {
//     console.error('Error fetching public data:', error);
//   }
// };
