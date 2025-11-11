import { NextRequest, NextResponse } from "next/server";
import { createAuthenticatedApi, handleApiError } from "../../../lib/api-utils";
import { authOptions } from "../auth/[...nextauth]/route";

export async function GET(request: NextRequest) {
  try {
    const chrysusApi = await createAuthenticatedApi();

    const { searchParams } = new URL(request.url);
    const phone = searchParams.get('phone') || '';

    const response = await chrysusApi.get(`/upis?phone=${phone}`);

    return NextResponse.json(response.data);
  } catch (error: any) {
    if (error.message === "Unauthorized") {
      return NextResponse.json(
        { success: false, message: "Unauthorized" },
        { status: 401 }
      );
    }
    
    const errorResponse = handleApiError(error, "UPIs");
    return NextResponse.json(
      errorResponse,
      { status: error.response?.status || 500 }
    );
  }
} 