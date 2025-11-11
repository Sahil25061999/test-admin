import { NextResponse } from "next/server";
import { getInvoice } from "../../../../backend/lib/getInvoice";

export const GET = async (
  request: Request,
  { params }: { params: { id: string } }
) => {
  try {
    const { id } = params;
    const invoice = await getInvoice(id);

    return NextResponse.json(
      {
        success: true,
        data: invoice,
      },
      { status: 201 }
    );
  } catch (e) {
    
    return NextResponse.json(
      {
        success: false,
        message: "Something went wrong",
      },
      {
        status: 500,
      }
    );
  }
};
