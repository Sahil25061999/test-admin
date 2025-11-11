import axios from "axios";
import { getServerSession } from "next-auth";
import CryptoJS from 'crypto-js';
import { authOptions } from "../app/api/auth/[...nextauth]/route";

export interface CustomSession {
  accessToken?: string;
  refreshToken?: string;
  phone?: string;
}

export const encryptToken = (plainText: string, key: string) => {
  try {
    const keyBytes = CryptoJS.enc.Hex.parse(key);
    const iv = CryptoJS.lib.WordArray.random(16);
    const encrypted = CryptoJS.AES.encrypt(plainText, keyBytes, {
      iv: iv,
      mode: CryptoJS.mode.CBC,
      padding: CryptoJS.pad.Pkcs7,
    });
    const ivCipher = iv.concat(encrypted.ciphertext as any);
    return CryptoJS.enc.Base64.stringify(ivCipher);
  } catch (error) {
    console.error("Encryption error:", error);
    return null;
  }
};

export const createAuthenticatedApi = async () => {
  const session = await getServerSession(authOptions) as CustomSession | null;
  
  if (!session?.accessToken) {
    throw new Error("Unauthorized");
  }

  const chrysusApi = axios.create({
    baseURL: process.env.NEXT_PUBLIC_CHRYSUS_URI,
    headers: {
      "Content-Type": "application/json",
      "Accept": "application/json",
      "Authorization": `Bearer ${session.accessToken}`
    }
  });

  // Add encrypted auth token
  const encryptedAccessToken = encryptToken(
    "N#8v!zXq3eP$wLr7@U2jT%9kBm5Qf4Y1",
    "6f8f57715090da2632453988d9a1501b6d4f7dffed6a532f1e3a7865e837a69a"
  );
  
  if (encryptedAccessToken) {
    chrysusApi.defaults.headers["X-Auth-Token"] = JSON.stringify(encryptedAccessToken);
  }

  return chrysusApi;
};

import { handleServerError } from './error-handler';

export const handleApiError = (error: any, operation: string) => {
  const apiError = handleServerError(error, operation);
  return {
    success: false,
    message: apiError.message
  };
}; 