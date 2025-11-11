import { NextResponse } from "next/server";
import { getUserCount } from "../../../../backend/lib/getUserCount";
 
export const GET = async (request: Request) => {
  try {
    const res = await getUserCount();
    
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
