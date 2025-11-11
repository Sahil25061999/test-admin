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
    
    if (!session?.accessToken) {
      return NextResponse.json(
        { success: false, message: "Unauthorized" },
        { status: 401 }
      );
    }

    const { searchParams } = new URL(request.url);
    const action = searchParams.get('action') || '';
    const product_name = searchParams.get('product_name') || '';
    const txn_id = searchParams.get('txn_id') || '';
    const new_status = searchParams.get('new_status') || '';
    const notes = searchParams.get('notes') || '';

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

    let endpoint = '';
    let params: any = {};

    switch (action) {
      case 'execute':
        endpoint = `redemption/v1/execute/txns?product_name=${product_name}`;
        params = { txn_id, new_status, notes };
        break;
      case 'cancel':
        endpoint = 'admin/v1/redeem-txn/cancel';
        params = { txn_id };
        break;
      case 'process':
        endpoint = '/admin/v1/process_redemption_order_transactions';
        break;
      default:
        return NextResponse.json(
          { success: false, message: "Invalid action parameter" },
          { status: 400 }
        );
    }

    const response = await chrysusApi.get(endpoint, { params });

    return NextResponse.json(response.data);
  } catch (error: any) {
    console.error("Redemption API error:", error);
    return NextResponse.json(
      { 
        success: false, 
        message: error.response?.data?.message || "Failed to process redemption" 
      },
      { status: error.response?.status || 500 }
    );
  }
} 