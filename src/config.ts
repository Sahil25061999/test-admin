"use client";
import axios from "axios";

const MOI_BASE_URL = process.env.NEXT_PUBLIC_MOI_URI;
const CHRYSUS_BASE_URL = process.env.NEXT_PUBLIC_CHRYSUS_URI;
const CONTENT_TYPE = "application/json";

export const MOI_API = axios.create({
  baseURL:MOI_BASE_URL,
  headers:{
    "Content-Type":CONTENT_TYPE,
    "Accept":"application/json"
  }
})

export const CHRYSUS_API = axios.create({
  baseURL:CHRYSUS_BASE_URL,
  headers:{
    "Content-Type":CONTENT_TYPE,
    "Accept":"application/json"
  }
})

export const refreshInstance = axios.create({
  baseURL: CHRYSUS_BASE_URL,
  timeout: 1000 * 30,
  headers: {
    // Authorization:'',
    Accept: "application/json",
    "Content-Type": "application/json",
  },
});

const tokenRefreshState = {
  refreshPromise: null,
};


const getAccessToken = async (refresh?:string) => {
  try {
    
    const res = await refreshInstance.post("/auth/v1/refresh",null);
    
    return res?.data;
  } catch (e) {
  
    if (e && e.response) {
      throw { ...e?.response?.data, status: e?.response?.status };
    } else {
      throw e;
    }
  }
};


CHRYSUS_API.interceptors.request.use(async(config) => {
  // if(!config.headers.Authorization){
  //   const res =  document.cookie;
  //   config.headers.Authorization ="Bearer "+ res;
  // }
  // return config;
  if (!config.headers.Authorization) {
    const res = document.cookie;
    config.headers.Authorization = res;
  }
  if (config.headers.Authorization && config.headers.Authorization.split(" ")[1] !== "null") {
    // Check for token expiration
    try {
      const token = config.headers.Authorization.split(" ")[1];
      const parts = token
        .split(".")
        .map((part) => Buffer.from(part.replace(/-/g, "+").replace(/_/g, "/"), "base64").toString());
      const payload = JSON.parse(parts[1]);

      // Only refresh if token is expired
      if (payload.exp < Math.floor(Date.now() / 1000)) {
        const refresh = localStorage.getItem("refreshToken");
        if (!refresh) return config;
        if (!tokenRefreshState.refreshPromise) {
          // Create a new refresh promise
          tokenRefreshState.refreshPromise = getAccessToken().finally(() => {
            // Clear the promise when done
            tokenRefreshState.refreshPromise = null;
          });
        }

        // Use a different axios instance or a simple fetch to avoid triggering this interceptor again
        const res = await tokenRefreshState.refreshPromise;

        if (res && res.success) {
          const accessToken = res?.data?.access_token;
          const refreshToken = res?.data?.refresh_token;
          localStorage.setItem("accessToken", accessToken);
          localStorage.setItem("refreshToken", refreshToken);

          config.headers.Authorization = `Bearer ${accessToken}`;
          CHRYSUS_API.defaults.headers.common["Authorization"] = `Bearer ${accessToken}`;
          refreshInstance.defaults.headers.common["Authorization"] = `Bearer ${refreshToken}`;
        }
      }
      return config;
    } catch (err) {
      return config;
    }
  } else {
    // Only get a new token if we don't have one
    const token = document.cookie;
    if (token) {
      config.headers.Authorization = token;
    }
    return config;
  }
}, (error) => {
  return Promise.reject(error);
})

async function refreshAccessToken() {
  try {

    if (!tokenRefreshState.refreshPromise) {
      // Create a new refresh promise
      tokenRefreshState.refreshPromise = getAccessToken().finally(() => {
        // Clear the promise when done
        tokenRefreshState.refreshPromise = null;
      });
    }

    // Use a different axios instance or a simple fetch to avoid triggering this interceptor again
    const res = await tokenRefreshState.refreshPromise;
    if (res && res.success) {
      const accessToken = res?.data?.access_token;
      const refreshToken = res?.data?.refresh_token;
      localStorage.setItem("accessToken", accessToken);
      localStorage.setItem("refreshToken", refreshToken);

      CHRYSUS_API.defaults.headers.common["Authorization"] = `Bearer ${accessToken}`;
      refreshInstance.defaults.headers.common["Authorization"] = `Bearer ${refreshToken}`;
    }
  } catch (e) {
  }
}

CHRYSUS_API.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalReq = error.config;
    if (
      error?.response?.status === 401
    ) {
      // if (!apiInstance.defaults.headers.common.Authorization) return;
      await refreshAccessToken()
      
    }

    return Promise.reject(error);
  }
);

refreshInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalReq = error.config;
    if (
      error?.response?.status === 401 || error?.response?.status === 403
    ) {
      // if (!apiInstance.defaults.headers.common.Authorization) return;
      localStorage.removeItem("token");
      localStorage.removeItem("refreshToken");
      window.location.href = "/login";
      // await refreshAccessToken()
      
    }
    

    return Promise.reject(error);
  }
);