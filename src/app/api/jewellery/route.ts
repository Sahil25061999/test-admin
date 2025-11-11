import { NextRequest, NextResponse } from "next/server";
import { createAuthenticatedApi } from "../../../lib/api-utils";
import { handleApiError } from "../../../lib/api-utils";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const chrysusApi = await createAuthenticatedApi();
    const response = await chrysusApi.post("jewellery/v1/", body);

    return NextResponse.json(response.data);
  } catch (error: any) {
    console.error("Jewellery create API error:", error?.details);
    const errorResponse = handleApiError(error, "jewellery creation");
    return NextResponse.json(errorResponse, { status: error.response?.status || 500 });
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);

    // metal_type is required
    const metal_type = searchParams.get("metal_type");
    if (!metal_type) {
      return NextResponse.json({ success: false, message: "metal_type parameter is required" }, { status: 400 });
    }

    const params: any = {
      metal_type,
    };

    // Optional parameters
    const gender = searchParams.get("gender");
    const category = searchParams.get("category");
    const limit = searchParams.get("limit");
    const offset = searchParams.get("offset");

    if (gender) params.gender = gender;
    if (category) params.category = category;
    if (limit) params.limit = limit;
    if (offset) params.offset = offset;

    const chrysusApi = await createAuthenticatedApi();
    const response = await chrysusApi.get("jewellery/v1/", { params });

    return NextResponse.json(response.data);
  } catch (error: any) {
    console.error("Jewellery fetch API error:", error);
    const errorResponse = handleApiError(error, "fetching jewellery");
    return NextResponse.json(errorResponse, { status: error.response?.status || 500 });
  }
}
