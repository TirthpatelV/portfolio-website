import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

export async function POST(request: NextRequest) {
  try {
    const { email, pin } = await request.json();

    // Validate input
    if (!email || !pin) {
      return NextResponse.json(
        { error: "Email and PIN are required" },
        { status: 400 },
      );
    }

    if (pin.length !== 4 || !/^\d{4}$/.test(pin)) {
      return NextResponse.json(
        { error: "PIN must be exactly 4 digits" },
        { status: 400 },
      );
    }

    // Get authenticated user's email from request
    const authHeader = request.headers.get("authorization");
    if (!authHeader?.startsWith("Bearer ")) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const token = authHeader.slice(7);

    // Create a client with the user's token to verify they own this email
    const userSupabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const userSupabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

    if (!userSupabaseUrl || !userSupabaseAnonKey) {
      return NextResponse.json(
        { error: "Server configuration error" },
        { status: 500 },
      );
    }

    const userClient = createClient(userSupabaseUrl, userSupabaseAnonKey, {
      global: { headers: { Authorization: `Bearer ${token}` } },
    });

    const {
      data: { user },
      error: userError,
    } = await userClient.auth.getUser();

    if (userError || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Verify the email matches the authenticated user's email
    if (user.email?.toLowerCase() !== email.toLowerCase()) {
      return NextResponse.json(
        { error: "Email does not match authenticated user" },
        { status: 403 },
      );
    }

    // Create service role client for database operations
    const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

    if (!supabaseServiceRoleKey) {
      console.error("SUPABASE_SERVICE_ROLE_KEY not configured");
      return NextResponse.json(
        { error: "Server configuration error" },
        { status: 500 },
      );
    }

    const adminClient = createClient(userSupabaseUrl, supabaseServiceRoleKey);

    // Upsert the PIN to admin_recovery table
    const { error: upsertError, data } = await adminClient
      .from("admin_recovery")
      .upsert(
        {
          email: email.toLowerCase(),
          pin: pin,
          updated_at: new Date().toISOString(),
        },
        { onConflict: "email" },
      )
      .select();

    if (upsertError) {
      console.error("PIN upsert error:", upsertError);
      return NextResponse.json(
        {
          error:
            "Failed to save PIN. Table may not exist. Run migration in Supabase.",
        },
        { status: 500 },
      );
    }

    return NextResponse.json({
      success: true,
      message: "Security PIN has been set successfully",
    });
  } catch (error) {
    console.error("Set PIN error:", error);
    return NextResponse.json(
      {
        error: "Failed to set PIN",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    );
  }
}
