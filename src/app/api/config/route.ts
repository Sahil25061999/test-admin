import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";
import { authOptions } from "../auth/[...nextauth]/route";
import axios from "axios";
import { encryptToken } from "../../../lib/api-utils";
import { handleServerError } from "../../../lib/error-handler";


interface CustomSession {
  accessToken?: string;
  refreshToken?: string;
  phone?: string;
}




export async function GET(
  request: NextRequest,
) {
  try {
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

    const response = await chrysusApi.get(
      `/admin/v1/config/keys`
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






export async function POST(request: NextRequest) {
  try {
    const session = (await getServerSession(authOptions)) as CustomSession | null;

    if (!session?.accessToken) {
      return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();


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
      chrysusApi.defaults.headers["X-Auth-Token"] = JSON.stringify(encryptedAccessToken);
    }

    const response = await chrysusApi.post(`/admin/v1/config/update`, body);

    return NextResponse.json(response.data);
  } catch (error: any) {
    console.error("Config POST error:", error);
    const apiError = handleServerError(error, "Update Config");

    return NextResponse.json(
      {
        success: false,
        message:
          error?.response?.data?.message ||
          apiError.message ||
          "Failed to update config",
      },
      { status: error?.response?.status || 500 }
    );
  }
}