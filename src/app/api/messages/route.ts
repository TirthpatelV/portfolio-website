import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { Resend } from "resend";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
const resendApiKey = process.env.RESEND_API_KEY;

const supabase = createClient(supabaseUrl || "", supabaseServiceKey || "");
const resend = new Resend(resendApiKey);

export async function GET() {
  try {
    const { data, error } = await supabase
      .from("contact_messages")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) throw error;

    return NextResponse.json(data || [], { status: 200 });
  } catch (error) {
    console.error("Error fetching messages:", error);
    return NextResponse.json(
      { error: "Failed to fetch messages" },
      { status: 500 },
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, email, message } = body;

    // Validate input
    if (!name || !email || !message) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 },
      );
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: "Invalid email format" },
        { status: 400 },
      );
    }

    // Store in database
    const { data: storedMessage, error: dbError } = await supabase
      .from("contact_messages")
      .insert([
        {
          name,
          email,
          message,
          read: false,
        },
      ])
      .select();

    if (dbError) throw dbError;

    // Send email notification
    const portfolioEmail = process.env.NEXT_PUBLIC_PORTFOLIO_EMAIL;
    const portfolioName =
      process.env.NEXT_PUBLIC_PORTFOLIO_NAME || "Portfolio Owner";

    if (resendApiKey) {
      try {
        await resend.emails.send({
          from: "Contact Form <onboarding@resend.dev>",
          to: portfolioEmail || "delivered@resend.dev",
          subject: `New Contact Form Message from ${name}`,
          html: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
              <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 20px; border-radius: 8px 8px 0 0; color: white;">
                <h2 style="margin: 0;">📧 New Contact Message</h2>
              </div>
              
              <div style="background: #f8f9fa; padding: 20px; border-radius: 0 0 8px 8px;">
                <p><strong>From:</strong> ${name}</p>
                <p><strong>Email:</strong> <a href="mailto:${email}">${email}</a></p>
                
                <div style="margin-top: 20px; padding: 15px; background: white; border-left: 4px solid #667eea; border-radius: 4px;">
                  <h3 style="margin-top: 0; color: #333;">Message:</h3>
                  <p style="color: #555; line-height: 1.6; white-space: pre-wrap;">${message}</p>
                </div>
                
                <div style="margin-top: 20px; padding-top: 20px; border-top: 1px solid #ddd; font-size: 12px; color: #999;">
                  <p>This email was sent from your portfolio contact form.</p>
                  <p style="margin: 5px 0;"><strong>Reply to:</strong> ${email}</p>
                </div>
              </div>
            </div>
          `,
        });
      } catch (emailError) {
        console.warn("Failed to send email notification:", emailError);
        // Don't fail the request if email fails, as the message is stored
      }
    }

    return NextResponse.json(storedMessage[0], { status: 201 });
  } catch (error) {
    console.error("Error creating message:", error);
    return NextResponse.json(
      { error: "Failed to send message" },
      { status: 500 },
    );
  }
}
