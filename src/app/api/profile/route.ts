import { NextRequest, NextResponse } from "next/server";
import { createAuthenticatedApi, encryptToken, handleApiError } from "../../../lib/api-utils";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/route";
import axios from "axios";



interface CustomSession {
  accessToken?: string;
  refreshToken?: string;
  phone?: string;
}

export async function GET(request: NextRequest) {
  try {
    const chrysusApi = await createAuthenticatedApi();

    const { searchParams } = new URL(request.url);
    const phoneNumber = searchParams.get('phone_number') || '';

    const response = await chrysusApi.get("/admin/v1/profile", {
      params: {
        phone_number: phoneNumber
      }
    });

    return NextResponse.json(response.data);
  } catch (error: any) {
    if (error.message === "Unauthorized") {
      return NextResponse.json(
        { success: false, message: "Unauthorized" },
        { status: 401 }
      );
    }

    const errorResponse = handleApiError(error, "Users");
    return NextResponse.json(
      errorResponse,
      { status: error.response?.status || 500 }
    );
  }
}


export async function PUT(request: NextRequest) {
  try {
    const session = (await getServerSession(authOptions)) as CustomSession | null;

    if (!session?.accessToken) {
      return NextResponse.json(
        { success: false, message: "Unauthorized" },
        { status: 401 }
      );
    }

    const body = await request.json();

    const chrysusApi = axios.create({
      baseURL: process.env.NEXT_PUBLIC_CHRYSUS_URI,
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        Authorization: `Bearer ${session.accessToken}`,
      },
      timeout: 10_000,
    });


    const encryptedAccessToken = encryptToken(
      "N#8v!zXq3eP$wLr7@U2jT%9kBm5Qf4Y1",
      "6f8f57715090da2632453988d9a1501b6d4f7dffed6a532f1e3a7865e837a69a"
    );

    if (encryptedAccessToken) {
      chrysusApi.defaults.headers.common["X-Auth-Token"] =
        JSON.stringify(encryptedAccessToken);
    }

    const response = await chrysusApi.put("/admin/v1/profile", body);

    console.log(response, "RESPONSE");

    return NextResponse.json(response.data, { status: 200 });
  } catch (error: any) {
    console.error("Update Profile API Error:", error?.response?.data);

    return NextResponse.json(
      {
        success: false,
        message:
          error?.response?.data?.message ||
          "Something went wrong while updating profile",
      },
      {
        status: error?.response?.status || 500,
      }
    );
  }
}
