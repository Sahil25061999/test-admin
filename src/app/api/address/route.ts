import { NextRequest, NextResponse } from "next/server"
import axios from "axios"
import { getServerSession } from "next-auth"
import CryptoJS from "crypto-js"
import { authOptions } from "../auth/[...nextauth]/route"

interface CustomSession {
  accessToken?: string
  refreshToken?: string
  phone?: string
}

const encryptToken = (plainText: string, key: string) => {
  try {
    const keyBytes = CryptoJS.enc.Hex.parse(key)
    const iv = CryptoJS.lib.WordArray.random(16)

    const encrypted = CryptoJS.AES.encrypt(plainText, keyBytes, {
      iv,
      mode: CryptoJS.mode.CBC,
      padding: CryptoJS.pad.Pkcs7,
    })

    const ivCipher = iv.concat(encrypted.ciphertext as any)
    return CryptoJS.enc.Base64.stringify(ivCipher)
  } catch (err) {
    console.error("Encryption error:", err)
    return null
  }
}

export async function GET(request: NextRequest) {
  try {
    const session = (await getServerSession(authOptions)) as CustomSession | null
    if (!session?.accessToken) {
      return NextResponse.json(
        { success: false, message: "Unauthorized" },
        { status: 401 }
      )
    }

    const phoneNumber = request.nextUrl.searchParams.get("phone_number")
    if (!phoneNumber) {
      return NextResponse.json(
        { success: false, message: "phone_number is required" },
        { status: 400 }
      )
    }

    const chrysusApi = axios.create({
      baseURL: process.env.NEXT_PUBLIC_CHRYSUS_URI,
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        Authorization: `Bearer ${session.accessToken}`,
      },
    })

    const encryptedAccessToken = encryptToken(
      "N#8v!zXq3eP$wLr7@U2jT%9kBm5Qf4Y1",
      "6f8f57715090da2632453988d9a1501b6d4f7dffed6a532f1e3a7865e837a69a"
    )

    if (encryptedAccessToken) {
      chrysusApi.defaults.headers["X-Auth-Token"] = encryptedAccessToken
    }

    const response = await chrysusApi.get(
      "/admin/v1/user/addresses",
      {
        params: {
          phone_number: phoneNumber,
        },
      }
    )

    return NextResponse.json(response.data)
  } catch (error: any) {
    console.error("Address API error:", error)

    return NextResponse.json(
      {
        success: false,
        message:
          error.response?.data?.message ||
          "Failed to fetch user addresses",
      },
      { status: error.response?.status || 500 }
    )
  }
}
