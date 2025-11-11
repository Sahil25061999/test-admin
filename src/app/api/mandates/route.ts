import { NextResponse, type NextRequest } from "next/server";
import { getMandates } from "../../../backend/lib/getMandates";
import { updateMandateStatus } from "../../../backend/lib/updateMandateStatus";

interface MandateParams{
  limit?: number;
  page?: number;
  phone?: string;
  txnid?: number;
  status?: string;
  startdate?: string;
  enddate?: string;
}


export const GET = async (request: NextRequest) => {
  try {
    const { searchParams } = request.nextUrl;
    let obj:MandateParams;
    for (let item of searchParams.entries()) {
      obj[item[0]] = item[1];
    }
    const res = await getMandates(obj);

    return NextResponse.json(
      {
        success: true,
        data: res,
      },
      {
        status: 201,
      }
    );
  } catch (e) {
    return NextResponse.json({ error: e }, { status: 500 });
  }
};

export const POST = async (request: Request) => {
  try {
    const { id, status } = await request.json();
    const res = await updateMandateStatus(id, status);
    return NextResponse.json(
      {
        data: res,
        success: true,
      },
      {
        status: 201,
      }
    );
  } catch (e) {
    return NextResponse.json({ error: e }, { status: 500 });
  }
};
