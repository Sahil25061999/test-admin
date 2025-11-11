import { NextRequest, NextResponse } from "next/server";
import axios from "axios";
import CryptoJS from 'crypto-js';

const encryptToken = (plainText: string, key: string) => {
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

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { countryCode, phone } = body;

    const chrysusApi = axios.create({
      baseURL: process.env.NEXT_PUBLIC_CHRYSUS_URI,
      headers: {
        "Content-Type": "application/json",
        "Accept": "application/json"
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

    const response = await chrysusApi.post("auth/v1/send-otp", {
      countryCode,
      phone
    });


    return NextResponse.json(response.data);
  } catch (error: any) {
    console.error("Send OTP error:", error?.response?.data);
    return NextResponse.json(
      { 
        success: false, 
        message: error.response?.data?.message || "Failed to send OTP" 
      },
      { status: error.response?.status || 500 }
    );
  }
} 