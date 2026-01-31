import { NextRequest, NextResponse } from "next/server";
import { createAuthenticatedApi, encryptToken, handleApiError } from "../../../lib/api-utils";





export async function GET(request: NextRequest) {
  try {
    const chrysusApi = await createAuthenticatedApi();

    const { searchParams } = new URL(request.url);
    const product = searchParams.get("product");

    if (!product) {
      return NextResponse.json(
        { message: "product param required" },
        { status: 400 }
      );
    }

    const response = await chrysusApi.get(
      "/data/v1/cron/update-prices",
      {
        params: { product },
      }
    );

    return NextResponse.json(response.data);
  } catch (error: any) {
    console.error("Update price error:", error);
    return NextResponse.json(
      { message: "Failed to update prices" },
      { status: 500 }
    );
  }
}
