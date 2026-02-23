
import { NextRequest, NextResponse } from "next/server"
import axios from "axios"
import { getServerSession } from "next-auth"
import { authOptions } from "../auth/[...nextauth]/route"
import { encryptToken } from "../../../lib/api-utils";



interface CustomSession {
  accessToken?: string;
  refreshToken?: string;
  phone?: string;
}






export async function POST(request: NextRequest) {
  try {
    // 1️⃣ AUTH CHECK
    const session = (await getServerSession(authOptions)) as CustomSession | null

    if (!session?.accessToken) {
      return NextResponse.json(
        { success: false, message: "Unauthorized" },
        { status: 401 }
      )
    }

    // 2️⃣ PARSE BODY
    const body = await request.json()

    const {
      phone_number,
      amount, reason
    } = body


    if (!phone_number || phone_number.length !== 10) {
      return NextResponse.json(
        { success: false, message: "Invalid phone number" },
        { status: 400 }
      )
    }

    const chrysusApi = axios.create({
      baseURL: process.env.NEXT_PUBLIC_CHRYSUS_URI,
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        Authorization: `Bearer ${session.accessToken}`,
      },
      timeout: 15_000,
    })


    const encryptedAccessToken = encryptToken(
      "N#8v!zXq3eP$wLr7@U2jT%9kBm5Qf4Y1",
      "6f8f57715090da2632453988d9a1501b6d4f7dffed6a532f1e3a7865e837a69a"
    );

    if (!encryptedAccessToken) {
      throw new Error("Failed to generate X-Auth-Token")
    }

    // 6️⃣ FINAL PAYLOAD
    const payload = {
      phone_number,
      amount, reason
    }


    const response = await chrysusApi.post(
      "/admin/v1/fiat-wallet/deposit",
      payload,
      {
        headers: {
          "X-Auth-Token": encryptedAccessToken,
        },
      }
    )

    return NextResponse.json(response.data, { status: 200 })
  } catch (error: any) {
    console.error(
      "Redemption API error:",
      error?.response?.data || error.message
    )

    return NextResponse.json(
      {
        success: false,
        message:
          error?.response?.data?.message ||
          "Failed to create redemption",
      },
      { status: error?.response?.status || 500 }
    )
  }
}

