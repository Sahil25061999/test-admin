import { NextRequest, NextResponse } from "next/server";
import axios from "axios";
import { getServerSession } from "next-auth";
import CryptoJS from 'crypto-js';
import { authOptions } from "../auth/[...nextauth]/route";

interface CustomSession {
  accessToken?: string;
  refreshToken?: string;
  phone?: string;
}

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
    const session = await getServerSession(authOptions) as CustomSession | null;

    if (!session?.accessToken) {
      return NextResponse.json(
        { success: false, message: "Unauthorized" },
        { status: 401 }
      );
    }

    const body = await request.json();


    const { phone, qty_to_debit, reason, metal_type } = body;

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

    const endpoint = '/admin/v1/withdraw-metal';
    const params = { phone, qty_to_debit, reason, metal_type };

    const response = await chrysusApi.post(endpoint, params);
    console.log(response, "EFEF")

    return NextResponse.json(response.data);
  } catch (error: any) {
    console.error("Deposit API error:", error?.response?.data);
    return NextResponse.json(
      {
        success: false,
        message: error.response?.data?.error || "Failed to process withdrawal"
      },
      { status: error.response?.status || 500 }
    );
  }
}