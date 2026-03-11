import { NextRequest, NextResponse } from "next/server";
import { createServerSupabaseClient } from "@/lib/supabase";

export async function POST(request: NextRequest) {
  try {
    const { email } = await request.json();

    if (!email) {
      return NextResponse.json(
        { message: "Email is required" },
        { status: 400 },
      );
    }

    // Create server-side Supabase client
    const supabase = await createServerSupabaseClient();

    // Send password reset email using Supabase auth
    const { data, error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"}/admin/reset-password-confirm`,
    });

    if (error) {
      console.error("Reset password error:", error);
      return NextResponse.json(
        { message: error.message || "Failed to send reset email" },
        { status: 400 },
      );
    }

    return NextResponse.json(
      { message: "Password reset email sent successfully" },
      { status: 200 },
    );
  } catch (error) {
    console.error("Password reset error:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 },
    );
  }
}
