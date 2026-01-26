import { NextRequest, NextResponse } from "next/server";
import axios from "axios";
import { getServerSession } from "next-auth";
import CryptoJS from "crypto-js";
import { authOptions } from "../auth/[...nextauth]/route";

interface CustomSession {
  accessToken?: string;
}

const encryptToken = (plainText: string, key: string) => {
  try {
    const keyBytes = CryptoJS.enc.Hex.parse(key);
    const iv = CryptoJS.lib.WordArray.random(16);

    const encrypted = CryptoJS.AES.encrypt(plainText, keyBytes, {
      iv,
      mode: CryptoJS.mode.CBC,
      padding: CryptoJS.pad.Pkcs7,
    });

    const ivCipher = iv.concat(encrypted.ciphertext as any);
    return CryptoJS.enc.Base64.stringify(ivCipher);
  } catch (err) {
    console.error("Encryption error", err);
    return null;
  }
};

export async function POST(request: NextRequest) {
  try {
    const session = (await getServerSession(authOptions)) as CustomSession | null;

    if (!session?.accessToken) {
      return NextResponse.json(
        { success: false, message: "Unauthorized" },
        { status: 401 }
      );
    }

    const { bank_account, ifsc } = await request.json();

    if (!bank_account || !ifsc) {
      return NextResponse.json(
        { success: false, message: "Bank account and IFSC are required" },
        { status: 400 }
      );
    }

    const chrysusApi = axios.create({
      baseURL: process.env.NEXT_PUBLIC_CHRYSUS_URI,
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        Authorization: `Bearer ${session.accessToken}`,
      },
    });

    const encryptedToken = encryptToken(
      "N#8v!zXq3eP$wLr7@U2jT%9kBm5Qf4Y1",
      "6f8f57715090da2632453988d9a1501b6d4f7dffed6a532f1e3a7865e837a69a"
    );

    if (encryptedToken) {
      chrysusApi.defaults.headers["X-Auth-Token"] = encryptedToken;
    }

    const response = await chrysusApi.post("/profile/v1/verify-bank", {
      bank_account,
      ifsc,
    });


    return NextResponse.json(
      JSON.parse(JSON.stringify(response.data))
    );
  } catch (error: any) {
    console.error("Verify bank error:", error?.response?.data || error);

    return NextResponse.json(
      {
        success: false,
        message:
          typeof error?.response?.data?.message === "string"
            ? error.response.data.message
            : "Failed to verify bank account",
      },
      { status: error?.response?.status ?? 500 }
    );
  }
}
