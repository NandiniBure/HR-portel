import axios, { AxiosError, InternalAxiosRequestConfig } from "axios";
import { refreshAccessToken } from "@/api/refreshTokenApi";

const API = axios.create({
  baseURL: "http://localhost:5000/api",
  withCredentials: true,
});

/* ---------------------------------- */
/* Attach token from localStorage    */
/* ---------------------------------- */
API.interceptors.request.use((config: InternalAxiosRequestConfig) => {
  const token = localStorage.getItem("token");

  if (token) {
    config.headers = config.headers || {};
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

/* ---------------------------------- */
/* Refresh handling (403 only)       */
/* ---------------------------------- */

let isRefreshing = false;
let requestQueue: any[] = [];

const processQueue = (error: any, token: string | null) => {
  requestQueue.forEach((p) => {
    if (error) p.reject(error);
    else p.resolve(token);
  });
  requestQueue = [];
};

API.interceptors.response.use(
  (res) => res,
  async (error: AxiosError) => {
    const originalRequest: any = error.config;

    console.log(error.response);
    if (
      error.response?.status === 403 &&
      originalRequest &&
      !originalRequest._retry
    ) {
      originalRequest._retry = true;

      /* If refresh already running → queue this request */
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          requestQueue.push({
            resolve: (token: string) => {
              originalRequest.headers.Authorization = `Bearer ${token}`;
              resolve(API(originalRequest));
            },
            reject,
          });
        });
      }

      isRefreshing = true;

      try {
        console.log("duvdsuiv");
        const newToken = await refreshAccessToken();

        if (!newToken) throw new Error("No token from refresh");

        localStorage.setItem("token", newToken);

        processQueue(null, newToken);

        originalRequest.headers.Authorization = `Bearer ${newToken}`;
        return API(originalRequest);
      } catch (refreshError) {
        processQueue(refreshError, null);

        // logout scenario
        // localStorage.removeItem("token");
        // window.location.href = "/login";

        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(error);
  }
);

export default API;
