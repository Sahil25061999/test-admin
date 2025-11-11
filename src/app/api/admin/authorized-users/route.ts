import { NextRequest, NextResponse } from "next/server";
import { 
  AUTHORIZED_USERS, 
  addAuthorizedUser, 
  removeAuthorizedUser,
  getUserByPhoneNumber,
  hasPermission 
} from "../../../../config/authorized-users";
import { createAuthenticatedApi } from "../../../../lib/api-utils";

// GET - List all authorized users
export async function GET(request: NextRequest) {
  try {
    const chrysusApi = await createAuthenticatedApi();
    
    // Check if the current user has admin permissions
    const session = await chrysusApi.get("admin/v1/profile");
    const currentUserPhone = session.data?.data?.user?.phone_number;
    
    if (!currentUserPhone || !hasPermission(currentUserPhone, "admin")) {
      return NextResponse.json(
        { success: false, message: "Access denied - Admin permission required" },
        { status: 403 }
      );
    }

    return NextResponse.json({
      success: true,
      data: AUTHORIZED_USERS
    });
  } catch (error: any) {
    if (error.message === "Unauthorized") {
      return NextResponse.json(
        { success: false, message: "Unauthorized" },
        { status: 401 }
      );
    }
    
    return NextResponse.json(
      { success: false, message: "Failed to fetch authorized users" },
      { status: 500 }
    );
  }
}

// POST - Add a new authorized user
export async function POST(request: NextRequest) {
  try {
    const chrysusApi = await createAuthenticatedApi();
    
    // Check if the current user has admin permissions
    const session = await chrysusApi.get("admin/v1/profile");
    const currentUserPhone = session.data?.data?.user?.phone_number;
    
    if (!currentUserPhone || !hasPermission(currentUserPhone, "admin")) {
      return NextResponse.json(
        { success: false, message: "Access denied - Admin permission required" },
        { status: 403 }
      );
    }

    const body = await request.json();
    const { phoneNumber, name, role, permissions } = body;

    // Validate required fields
    if (!phoneNumber || !name || !role || !permissions) {
      return NextResponse.json(
        { success: false, message: "Missing required fields" },
        { status: 400 }
      );
    }

    // Check if user already exists
    if (getUserByPhoneNumber(phoneNumber)) {
      return NextResponse.json(
        { success: false, message: "User already exists" },
        { status: 409 }
      );
    }

    // Add the new user
    addAuthorizedUser({
      phoneNumber,
      name,
      role,
      permissions
    });

    return NextResponse.json({
      success: true,
      message: "User added successfully",
      data: getUserByPhoneNumber(phoneNumber)
    });
  } catch (error: any) {
    if (error.message === "Unauthorized") {
      return NextResponse.json(
        { success: false, message: "Unauthorized" },
        { status: 401 }
      );
    }
    
    return NextResponse.json(
      { success: false, message: "Failed to add user" },
      { status: 500 }
    );
  }
}

// DELETE - Remove an authorized user
export async function DELETE(request: NextRequest) {
  try {
    const chrysusApi = await createAuthenticatedApi();
    
    // Check if the current user has admin permissions
    const session = await chrysusApi.get("admin/v1/profile");
    const currentUserPhone = session.data?.data?.user?.phone_number;
    
    if (!currentUserPhone || !hasPermission(currentUserPhone, "admin")) {
      return NextResponse.json(
        { success: false, message: "Access denied - Admin permission required" },
        { status: 403 }
      );
    }

    const { searchParams } = new URL(request.url);
    const phoneNumber = searchParams.get('phoneNumber');

    if (!phoneNumber) {
      return NextResponse.json(
        { success: false, message: "Phone number is required" },
        { status: 400 }
      );
    }

    // Check if user exists
    if (!getUserByPhoneNumber(phoneNumber)) {
      return NextResponse.json(
        { success: false, message: "User not found" },
        { status: 404 }
      );
    }

    // Remove the user
    const removed = removeAuthorizedUser(phoneNumber);

    if (removed) {
      return NextResponse.json({
        success: true,
        message: "User removed successfully"
      });
    } else {
      return NextResponse.json(
        { success: false, message: "Failed to remove user" },
        { status: 500 }
      );
    }
  } catch (error: any) {
    if (error.message === "Unauthorized") {
      return NextResponse.json(
        { success: false, message: "Unauthorized" },
        { status: 401 }
      );
    }
    
    return NextResponse.json(
      { success: false, message: "Failed to remove user" },
      { status: 500 }
    );
  }
} 