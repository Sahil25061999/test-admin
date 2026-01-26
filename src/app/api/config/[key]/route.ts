import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";

import axios from "axios";
import { authOptions } from "../../auth/[...nextauth]/route";
import { encryptToken } from "../../../../lib/api-utils";


interface CustomSession {
  accessToken?: string;
  refreshToken?: string;
  phone?: string;
}




export async function GET(
  request: NextRequest,
  { params }: { params: { key: string } }
) {
  try {
    console.log("Fetching config for key:", params.key);
    const session = (await getServerSession(authOptions)) as CustomSession | null;

    if (!session?.accessToken) {
      console.error("Unauthorized: No access token in session");
      return NextResponse.json(
        { success: false, message: "Unauthorized" },
        { status: 401 }
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

    const encryptedAccessToken = encryptToken(
      "N#8v!zXq3eP$wLr7@U2jT%9kBm5Qf4Y1",
      "6f8f57715090da2632453988d9a1501b6d4f7dffed6a532f1e3a7865e837a69a"
    );

    if (encryptedAccessToken) {
      console.log("X-Auth-Token successfully encrypted");
      chrysusApi.defaults.headers["X-Auth-Token"] =
        JSON.stringify(encryptedAccessToken);
    }

    console.log(`Requesting external config: /admin/v1/config/${params.key}`);
    const response = await chrysusApi.get(
      `admin/v1/config/${params.key}`
    );

    console.log("Config successfully retrieved from external API");
    return NextResponse.json(response.data);
  } catch (error: any) {
    console.error("Error in GET /api/config:", error.response?.data || error.message);
    return NextResponse.json(
      {
        success: false,
        message:
          error.response?.data?.message || "Failed to fetch config value",
      },
      { status: error.response?.status || 500 }
    );
  }
}
