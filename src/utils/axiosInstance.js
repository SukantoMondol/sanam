import axios from "axios";

import { API_BASE_URL } from "@/utils/apiBase";
import { getGuestToken } from "@/utils/guestToken";

const GUEST_ENDPOINTS = [
  "/cart",
  "/clear-cart",
  "/order",
  "/quick-order",
];

const shouldSendGuestToken = (url = "") =>
  GUEST_ENDPOINTS.some((endpoint) => url === endpoint || url.startsWith(`${endpoint}/`));

// Create a single reusable instance with optimized settings
const axiosInstance = axios.create({
  baseURL: API_BASE_URL,
  timeout: 15000, // Reduced from 90s to 15s for faster failover
  headers: {
    "Cache-Control": "no-cache",
  },
});

// Request interceptor - lightweight and fast
axiosInstance.interceptors.request.use(
  async (config) => {
    config.headers = config.headers || {};
    if (typeof window !== "undefined") {
      try {
        const { getCookie } = await import("cookies-next");
        const authToken = getCookie("token");
        if (authToken) {
          config.headers.Authorization = `Bearer ${authToken}`;
        } else if (shouldSendGuestToken(config.url)) {
          const guestToken = getGuestToken();
          if (guestToken) {
            config.headers["X-Guest-Token"] = guestToken;
          }
        }
      } catch (err) {
        // If cookies-next is unavailable on server, skip auth header.
      }
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor - streamlined
axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    // Handle build-time network errors gracefully
    if (
      error.code === "ECONNREFUSED" ||
      error.code === "ENOTFOUND" ||
      error.code === "ECONNABORTED" ||
      error.message.includes("socket hang up")
    ) {
      console.warn("API unavailable, using fallback data");
      return Promise.reject(error);
    }

    if (error.response?.status === 401 && typeof window !== "undefined") {
      try {
        const { deleteCookie } = await import("cookies-next");
        deleteCookie("token");
      } catch (e) {
        // ignore
      }
      localStorage.removeItem("token");
      window.location.href = "/sign-in";
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;
