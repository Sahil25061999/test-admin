
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
    const metal_type = searchParams.get("metal_type") || '';
    const product_type = searchParams.get("product_type") || '';
    console.log(metal_type, product_type, "METAL TYPE AND PRODUCT TYPE")

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

    let endpoint = `/redemption/v1/info?metal_type=${metal_type}&product_type=${product_type}`
    let params: any = {
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



export async function PUT(request: NextRequest) {
  try {
    const session = (await getServerSession(authOptions)) as CustomSession | null

    if (!session?.accessToken) {
      return NextResponse.json(
        { success: false, message: "Unauthorized" },
        { status: 401 }
      )
    }

    const body = await request.json()

    const {

      metal_type,
      product_type,

      weight, quantity
    } = body


    if (!weight) {
      return NextResponse.json(
        { success: false, message: "Invalid weight" },
        { status: 400 }
      )
    }

    if (!metal_type || !product_type) {
      return NextResponse.json(
        { success: false, message: "Product details missing" },
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

    const payload = {
      metal_type,
      product_type,
      weight,
      available_quantity: quantity
    }

    const response = await chrysusApi.put(
      "/admin/v1/redemption-info/quantity",
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
          "Failed to update redemption info",
      },
      { status: error?.response?.status || 500 }
    )
  }
}