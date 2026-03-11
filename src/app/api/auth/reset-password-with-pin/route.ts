import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

// Update password after PIN verification
export async function POST(request: NextRequest) {
  try {
    const { email, newPassword } = await request.json();

    if (!email || !newPassword) {
      return NextResponse.json(
        { message: "Email and password required" },
        { status: 400 },
      );
    }

    // Validate password
    if (newPassword.length < 6) {
      return NextResponse.json(
        { message: "Password must be at least 6 characters" },
        { status: 400 },
      );
    }

    // Check password strength
    const hasUppercase = /[A-Z]/.test(newPassword);
    const hasLowercase = /[a-z]/.test(newPassword);
    const hasNumber = /\d/.test(newPassword);
    const strongPassword = hasUppercase && hasLowercase && hasNumber;

    if (!strongPassword) {
      return NextResponse.json(
        {
          message:
            "Password must contain at least one uppercase letter, one lowercase letter, and one number",
        },
        { status: 400 },
      );
    }

    // Create service role client
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

    if (!supabaseUrl || !supabaseServiceRoleKey) {
      return NextResponse.json(
        { message: "Server configuration error" },
        { status: 500 },
      );
    }

    const supabase = createClient(supabaseUrl, supabaseServiceRoleKey);

    // Get user ID from email
    const { data: users, error: userError } =
      await supabase.auth.admin.listUsers();

    if (userError) {
      console.error("Error listing users:", userError);
      return NextResponse.json(
        { message: "Failed to find user" },
        { status: 500 },
      );
    }

    const user = users?.users.find(
      (u) => u.email?.toLowerCase() === email.toLowerCase(),
    );

    if (!user) {
      // Return generic error to prevent email enumeration
      return NextResponse.json({ message: "Invalid email" }, { status: 400 });
    }

    // Update password via Supabase admin API
    const { error: updateError } = await supabase.auth.admin.updateUserById(
      user.id,
      {
        password: newPassword,
      },
    );

    if (updateError) {
      console.error("Password update error:", updateError);
      return NextResponse.json(
        { message: "Failed to update password" },
        { status: 400 },
      );
    }

    return NextResponse.json(
      { message: "Password updated successfully" },
      { status: 200 },
    );
  } catch (error) {
    console.error("Password update error:", error);
    return NextResponse.json({ message: "Server error" }, { status: 500 });
  }
}
