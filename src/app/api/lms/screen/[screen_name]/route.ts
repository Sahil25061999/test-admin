import { NextRequest, NextResponse } from "next/server";
import axios from "axios";
import { getServerSession } from "next-auth";
import { authOptions } from "../../../auth/[...nextauth]/route";
import { CustomSession, encryptToken } from "../../../../../lib/api-utils";
import { handleServerError } from "../../../../../lib/error-handler";

export async function GET(request: NextRequest, { params }: { params: { screen_name: string } }) {
  try {
    const session = (await getServerSession(authOptions)) as CustomSession | null;

    if (!session?.accessToken) {
      return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
    }

    const { screen_name } = params;

    const chrysusApi = axios.create({
      baseURL: process.env.NEXT_PUBLIC_CHRYSUS_URI,
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        Authorization: `Bearer ${session.accessToken}`,
      },
    });

    // Add encrypted auth token
    const encryptedAccessToken = encryptToken(
      "N#8v!zXq3eP$wLr7@U2jT%9kBm5Qf4Y1",
      "6f8f57715090da2632453988d9a1501b6d4f7dffed6a532f1e3a7865e837a69a"
    );

    if (encryptedAccessToken) {
      chrysusApi.defaults.headers["X-Auth-Token"] = JSON.stringify(encryptedAccessToken);
    }

    const response = await chrysusApi.get(`/lms/v1/screen/${screen_name}`);

    return NextResponse.json(response.data);
  } catch (error: any) {
    console.error("LMS Screen GET error:", error);
    const apiError = handleServerError(error, "Get LMS Screen Config");
    return NextResponse.json(
      {
        success: false,
        message: error.response?.data?.message || apiError.message || "Failed to fetch screen configuration",
      },
      { status: error.response?.status || 500 }
    );
  }
}

export async function PUT(request: NextRequest, { params }: { params: { screen_name: string } }) {
  try {
    const session = (await getServerSession(authOptions)) as CustomSession | null;

    if (!session?.accessToken) {
      return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
    }

    const { screen_name } = params;
    const body = await request.json();

    const chrysusApi = axios.create({
      baseURL: process.env.NEXT_PUBLIC_CHRYSUS_URI,
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        Authorization: `Bearer ${session.accessToken}`,
      },
    });

    // Add encrypted auth token
    const encryptedAccessToken = encryptToken(
      "N#8v!zXq3eP$wLr7@U2jT%9kBm5Qf4Y1",
      "6f8f57715090da2632453988d9a1501b6d4f7dffed6a532f1e3a7865e837a69a"
    );

    if (encryptedAccessToken) {
      chrysusApi.defaults.headers["X-Auth-Token"] = JSON.stringify(encryptedAccessToken);
    }

    const response = await chrysusApi.put(`/lms/v1/screen/${screen_name}`, body);

    return NextResponse.json(response.data);
  } catch (error: any) {
    console.error("LMS Screen PUT error:", error);
    const apiError = handleServerError(error, "Update LMS Screen Config");
    return NextResponse.json(
      {
        success: false,
        message: error.response?.data?.message || apiError.message || "Failed to update screen configuration",
      },
      { status: error.response?.status || 500 }
    );
  }
}
