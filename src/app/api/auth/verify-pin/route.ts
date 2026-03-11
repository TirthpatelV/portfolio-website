import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

// Verify admin PIN
export async function POST(request: NextRequest) {
  try {
    const { email, pin } = await request.json();

    if (!email || !pin) {
      return NextResponse.json(
        { message: "Email and PIN required" },
        { status: 400 },
      );
    }

    if (pin.length !== 4 || !/^\d{4}$/.test(pin)) {
      return NextResponse.json(
        { message: "Invalid PIN format" },
        { status: 400 },
      );
    }

    // Create service role client for database access
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

    if (!supabaseUrl || !supabaseServiceRoleKey) {
      return NextResponse.json(
        { message: "Server configuration error" },
        { status: 500 },
      );
    }

    const supabase = createClient(supabaseUrl, supabaseServiceRoleKey);

    // Get admin PIN from database
    const { data, error } = await supabase
      .from("admin_recovery")
      .select("pin")
      .eq("email", email.toLowerCase())
      .single();

    if (error || !data) {
      // Return generic error to prevent email enumeration
      return NextResponse.json(
        { message: "Invalid email or PIN" },
        { status: 400 },
      );
    }

    // Verify PIN (simple comparison - in production, use bcrypt.compare)
    if (data.pin !== pin) {
      return NextResponse.json({ message: "Invalid PIN" }, { status: 400 });
    }

    return NextResponse.json(
      { message: "PIN verified successfully", verified: true },
      { status: 200 },
    );
  } catch (error) {
    console.error("PIN verification error:", error);
    return NextResponse.json({ message: "Server error" }, { status: 500 });
  }
}
