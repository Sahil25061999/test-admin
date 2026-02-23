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

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions) as CustomSession | null;
    console.log("SESSION TRANSACTIONS==>", session);
    if (!session?.accessToken) {
      return NextResponse.json(
        { success: false, message: "Unauthorized" },
        { status: 401 }
      );
    }

    const { searchParams } = request.nextUrl;

    const phone_number = searchParams.get("phone_number");
    const txn_type = searchParams.get("txn_type");
    const txn_status = searchParams.get("txn_status");
    const offset = searchParams.get("offset") ?? 0;
    const limit = searchParams.get("limit") ?? 10;
    const category = searchParams.get("category");
    const product_name = searchParams.get("product_name");


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

    const queryParams = new URLSearchParams(
      Object.entries({
        phone_number,
        txn_type,
        txn_status,
        offset: String(offset),
        limit: String(limit),
        category,
        product_name
      }).filter(([, v]) => v !== null)
    ).toString();

    // /admin/v1/transactions?phone_number=&txn_type=BUY&txn_status=ACTIVE&offset=0&limit=5&category=gold_redemption&product_name=GOLD24


    const fullUrl = `/admin/v1/transactions?${queryParams}`;
    console.log("FULL URL==> MAN", fullUrl)
    const response = await chrysusApi.get(fullUrl);
    console.log(response?.data?.transactions?.[0], "RESPONSE")

    return NextResponse.json(response.data);
  } catch (error: any) {
    console.error("Transactions API error:", error);
    return NextResponse.json(
      {
        success: false,
        message: error.response?.data?.message || "Failed to fetch transactions"
      },
      { status: error.response?.status || 500 }
    );
  }
}