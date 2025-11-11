import { NextRequest, NextResponse } from "next/server";
import { createAuthenticatedApi, handleApiError } from "../../../lib/api-utils";
import { authOptions } from "../auth/[...nextauth]/route";

export async function GET(request: NextRequest) {
  try {
    const chrysusApi = await createAuthenticatedApi();

    const { searchParams } = new URL(request.url);
    const name = searchParams.get('name') || '';
    const phone = searchParams.get('phone') || '';
    const txnid = searchParams.get('txnid') || '';
    const page = searchParams.get('page') || '1';
    const limit = searchParams.get('limit') || '10';
    const status = searchParams.get('status') || '';
    const startdate = searchParams.get('startdate') || '';
    const enddate = searchParams.get('enddate') || '';

    const response = await chrysusApi.get("admin/v1/users", {
      params: {
        name,
        phone,
        txnid,
        page,
        limit,
        status,
        startdate,
        enddate
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