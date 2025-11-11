import { NextRequest, NextResponse } from "next/server";
import { createAuthenticatedApi } from "../../../lib/api-utils";
import { handleApiError } from "../../../lib/api-utils";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { phone_number, qty_g, product_name } = body;

    // Validate required fields
    if (!phone_number || !qty_g || !product_name) {
      return NextResponse.json(
        { success: false, message: "Missing required fields: phone_number, qty_g, product_name" },
        { status: 400 }
      );
    }

    // Validate product_name
    if (product_name !== "SILVER24" && product_name !== "GOLD24") {
      return NextResponse.json(
        { success: false, message: "product_name must be either SILVER24 or GOLD24" },
        { status: 400 }
      );
    }

    // Validate qty_g is a valid number
    const qty = parseFloat(qty_g);
    if (isNaN(qty) || qty <= 0) {
      return NextResponse.json({ success: false, message: "qty_g must be a positive number" }, { status: 400 });
    }

    const chrysusApi = await createAuthenticatedApi();

    const response = await chrysusApi.post("wallet/v1/update-wallet", {
      phone_number,
      qty_g: qty,
      product_name,
    });

    return NextResponse.json(response.data);
  } catch (error: any) {
    console.error("Wallet update API error:", error);
    const errorResponse = handleApiError(error, "wallet update");
    return NextResponse.json(errorResponse, { status: error.response?.status || 500 });
  }
}
