import { NextRequest, NextResponse } from "next/server";
import { createAuthenticatedApi } from "../../../../../lib/api-utils";
import { handleApiError } from "../../../../../lib/api-utils";

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const body = await request.json();
    const categoryId = params.id;

    const chrysusApi = await createAuthenticatedApi();
    const response = await chrysusApi.put(`jewellery/v1/categories/${categoryId}`, body);

    return NextResponse.json(response.data);
  } catch (error: any) {
    console.error("Category update API error:", error);
    const errorResponse = handleApiError(error, "category update");
    return NextResponse.json(errorResponse, { status: error.response?.status || 500 });
  }
}
