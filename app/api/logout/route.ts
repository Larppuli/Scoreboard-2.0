import { NextResponse } from "next/server";

export async function POST() {
  try {
    // Clear the session cookie
    const response = NextResponse.json(
      { success: true, message: "Logout successful" },
      { status: 200 }
    );
    response.cookies.delete("session");
    return response;
  } catch (error) {
    console.error("Logout error:", error);
    return NextResponse.json(
      { errors: { general: "Something went wrong, please try again." } },
      { status: 500 }
    );
  }
}
