
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
    const weight = searchParams.get('weight') || '';
    const metal_type = searchParams.get("metal_type") || '';
    const product_type = searchParams.get("product_type") || '';

    const chrysusApi = axios.create({
      baseURL: process.env.NEXT_PUBLIC_CHRYSUS_URI,
      headers: {
        "Content-Type": "application/json",
        "Accept": "application/json",
        "Authorization": `Bearer ${session.accessToken}`
      }
    });


    const encryptedAccessToken = encryptToken(
      "N#8v!zXq3eP$wLr7@U2jT%9kBm5Qf4Y1",
      "6f8f57715090da2632453988d9a1501b6d4f7dffed6a532f1e3a7865e837a69a"
    );

    if (encryptedAccessToken) {
      chrysusApi.defaults.headers["X-Auth-Token"] = JSON.stringify(encryptedAccessToken);
    }

    let endpoint = "/admin/v1/redemption-info"
    let params: any = {
      weight,
      metal_type,
      product_type,
    };




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
      product_name,
      metal_type,
      product_type,
      karat = null,
      quantities,
      vault_value = 0,
      address_id,
      platform = "web",
      version = "4.0.0",
      mode = "prod",
    } = body

    // 3️⃣ VALIDATION
    if (!phone_number || phone_number.length !== 10) {
      return NextResponse.json(
        { success: false, message: "Invalid phone number" },
        { status: 400 }
      )
    }

    if (!product_name || !metal_type || !product_type) {
      return NextResponse.json(
        { success: false, message: "Product details missing" },
        { status: 400 }
      )
    }

    if (!address_id) {
      return NextResponse.json(
        { success: false, message: "Address is required" },
        { status: 400 }
      )
    }

    if (
      !quantities ||
      typeof quantities !== "object" ||
      !Object.keys(quantities).length
    ) {
      return NextResponse.json(
        { success: false, message: "Quantities are required" },
        { status: 400 }
      )
    }

    // 4️⃣ CREATE AXIOS CLIENT
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
      product_name,
      metal_type,
      product_type,
      karat,
      quantities,
      vault_value,
      address_id,
      platform,
      version,
      mode,
    }

    // 7️⃣ MAKE REQUEST (HEADER PASSED PER REQUEST 🔥)
    const response = await chrysusApi.post(
      "/admin/v1/redemption/create",
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

