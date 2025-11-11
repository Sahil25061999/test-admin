import { NextRequest, NextResponse } from "next/server";
import { createAuthenticatedApi, handleApiError } from "../../../lib/api-utils";

export async function GET(request: NextRequest) {
  try {
    const chrysusApi = await createAuthenticatedApi();

    const response = await chrysusApi.get("admin/v1/stats");
    console.log("RESPONSE==>", response);
    return NextResponse.json(response.data);
  } catch (error: any) {
    if (error.message === "Unauthorized") {
      return NextResponse.json(
        { success: false, message: "Unauthorized" },
        { status: 401 }
      );
    }
    
    const errorResponse = handleApiError(error, "Stats");
    return NextResponse.json(
      errorResponse,
      { status: error.response?.status || 500 }
    );
  }
} 