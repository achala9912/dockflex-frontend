// "use client";

// import { useAuthStore } from "@/store/authStore";
// import { getToken } from "@/store/session_storage";
// import { useLoaderStore } from "@/store/useLoaderStore";
// import axios, {
//   AxiosInstance,
//   InternalAxiosRequestConfig,
//   AxiosHeaders,
// } from "axios";
// import { toast } from "react-toastify";

// interface CustomAxiosRequestConfig extends InternalAxiosRequestConfig {
//   skipLoading?: boolean;
// }

// const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "";

// const axiosAuth: AxiosInstance = axios.create({
//   baseURL: `${BASE_URL}/api/v1`,
//   headers: {
//     "Content-Type": "application/json",
//   },
// });

// axiosAuth.interceptors.request.use(
//   (config: CustomAxiosRequestConfig) => {
//     const setLoading = useLoaderStore.getState().setLoading;

//     if (!config.skipLoading) {
//       setLoading(true);
//     }

//     const token = getToken();
//     if (token && !config.headers?.has("Authorization")) {
//       config.headers = config.headers || new AxiosHeaders();
//       config.headers.set("Authorization", token);
//     }

//     return config;
//   },
//   (error) => {
//     useLoaderStore.getState().setLoading(false);
//     return Promise.reject(error);
//   }
// );

// // Response interceptor
// axiosAuth.interceptors.response.use(
//   (response) => {
//     useLoaderStore.getState().setLoading(false);
//     return response?.data;
//   },
//   (error) => {
//     console.error("🚀 ~ error:", error);
//     useLoaderStore.getState().setLoading(false);

//     let errMessage = "";
//     const status = error?.response?.status;
//     const message = error?.response?.data?.message || "";

//     if (status === 401) {
//       console.log("Unauthorized, logging out current session ...");
//       const logout = useAuthStore.getState().logout;
//       logout();
//       window.location.href = "/";
//     } else if (status === 400) {
//       errMessage = message || "Bad Request";
//     } else if (status === 404) {
//       errMessage = message || "Not Found";
//     } else if (status === 403) {
//       errMessage = message || "Forbidden";
//     } else if (status === 500) {
//       errMessage = message || "Internal Server Error";
//     } else {
//       errMessage = message || "An error occurred";
//     }

//     toast.error(errMessage);
//     return Promise.reject({ code: status, message: errMessage });
//   }
// );

// export default axiosAuth;


import { useAuthStore } from "@/store/authStore";
import { getToken } from "@/store/session_storage";
import { useLoaderStore } from "@/store/useLoaderStore";
import axios, { AxiosInstance, InternalAxiosRequestConfig, AxiosHeaders } from "axios";
import { toast } from "react-toastify";

interface CustomAxiosRequestConfig extends InternalAxiosRequestConfig {
  skipLoading?: boolean;
}

const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "";

const axiosAuth: AxiosInstance = axios.create({
  baseURL: `${BASE_URL}/api/v1`,
  headers: {
    "Content-Type": "application/json",
  },
});

axiosAuth.interceptors.request.use(
  (config: CustomAxiosRequestConfig) => {
    if (!config.skipLoading) {
      useLoaderStore.getState().startLoading();
    }

    const token = getToken();
    if (token && !config.headers?.has("Authorization")) {
      config.headers = config.headers || new AxiosHeaders();
      config.headers.set("Authorization", token);
    }

    return config;
  },
  (error) => {
    useLoaderStore.getState().stopLoading();
    return Promise.reject(error);
  }
);

axiosAuth.interceptors.response.use(
  (response) => {
    useLoaderStore.getState().stopLoading();
    return response?.data;
  },
  (error) => {
    useLoaderStore.getState().stopLoading();

    const status = error?.response?.status;
    const message = error?.response?.data?.message || "";

    if (status === 401) {
      console.log("Unauthorized, logging out current session ...");
      const logout = useAuthStore.getState().logout;
      logout();
      window.location.href = "/";
    }

    let errMessage = "";
    if (status === 400) errMessage = message || "Bad Request";
    else if (status === 404) errMessage = message || "Not Found";
    else if (status === 403) errMessage = message || "Forbidden";
    else if (status === 500) errMessage = message || "Internal Server Error";
    else errMessage = message || "An error occurred";

    toast.error(errMessage);
    return Promise.reject({ code: status, message: errMessage });
  }
);

export default axiosAuth;
