import { NextRequest, NextResponse } from "next/server";
import { createAuthenticatedApi } from "../../../../lib/api-utils";
import { handleApiError } from "../../../../lib/api-utils";

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const jewelleryId = params.id;

    const chrysusApi = await createAuthenticatedApi();
    const response = await chrysusApi.get(`jewellery/v1/${jewelleryId}`);

    return NextResponse.json(response.data);
  } catch (error: any) {
    console.error("Jewellery fetch API error:", error);
    const errorResponse = handleApiError(error, "fetching jewellery");
    return NextResponse.json(errorResponse, { status: error.response?.status || 500 });
  }
}

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const body = await request.json();
    const jewelleryId = params.id;

    const chrysusApi = await createAuthenticatedApi();
    const response = await chrysusApi.put(`jewellery/v1/${jewelleryId}`, body);

    return NextResponse.json(response.data);
  } catch (error: any) {
    console.error("Jewellery update API error:", error);
    const errorResponse = handleApiError(error, "jewellery update");
    return NextResponse.json(errorResponse, { status: error.response?.status || 500 });
  }
}

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const jewelleryId = params.id;

    const chrysusApi = await createAuthenticatedApi();
    const response = await chrysusApi.delete(`jewellery/v1/${jewelleryId}`);

    return NextResponse.json(response.data);
  } catch (error: any) {
    console.error("Jewellery delete API error:", error);
    const errorResponse = handleApiError(error, "jewellery deletion");
    return NextResponse.json(errorResponse, { status: error.response?.status || 500 });
  }
}
