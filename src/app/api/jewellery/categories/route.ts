import { NextRequest, NextResponse } from "next/server";
import { createAuthenticatedApi } from "../../../../lib/api-utils";
import { handleApiError } from "../../../../lib/api-utils";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const chrysusApi = await createAuthenticatedApi();
    const response = await chrysusApi.post("jewellery/v1/categories", body);

    return NextResponse.json(response.data);
  } catch (error: any) {
    console.error("Category create API error:", error);
    const errorResponse = handleApiError(error, "category creation");
    return NextResponse.json(errorResponse, { status: error.response?.status || 500 });
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const metal_type = searchParams.get("metal_type");

    const chrysusApi = await createAuthenticatedApi();

    // If metal_type is provided, get categories by metal type
    if (metal_type) {
      const response = await chrysusApi.get(`jewellery/v1/categories/${metal_type}`);
      return NextResponse.json(response.data);
    }

    // Otherwise, get all categories
    const response = await chrysusApi.get("jewellery/v1/categories");
    return NextResponse.json(response.data);
  } catch (error: any) {
    console.error("Category fetch API error:", error);
    const errorResponse = handleApiError(error, "fetching categories");
    return NextResponse.json(errorResponse, { status: error.response?.status || 500 });
  }
}
