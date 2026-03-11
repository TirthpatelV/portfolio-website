# Password Recovery System Setup

## Overview

The admin password recovery system allows you to reset your Supabase password if forgotten. This involves:

- **Forgot Password Page**: Request a password reset link
- **Email Delivery**: Supabase sends a reset link to your email
- **Password Reset Form**: Set a new password using the link

## How It Works

### Step 1: Request Password Reset

1. Go to `/admin/login`
2. Click the **"FORGOT?"** button below the password field
3. Enter your admin email address
4. Click **"Send Reset Link"**

### Step 2: Check Your Email

- You should receive an email from Supabase with a password reset link
- The link expires in **1 hour**
- Click the link to proceed to the password reset form

### Step 3: Set New Password

1. On the reset password page, enter your new password
2. Confirm your password
3. Click **"Update Password"**
4. You'll be redirected to the login page

### Step 4: Login with New Password

- Go to `/admin/login`
- Use your email and new password to login

## Required Environment Variables

Make sure your `.env.local` file contains:

```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key

# App URL (for reset password redirect)
NEXT_PUBLIC_APP_URL=http://localhost:3000
# For production: NEXT_PUBLIC_APP_URL=https://yourdomain.com
```

## Supabase Configuration

### 1. Enable Email Provider

In Supabase Dashboard:

1. Go to **Authentication** → **Providers**
2. Ensure **Email** provider is enabled (it's enabled by default)

### 2. Configure Redirect URL

In Supabase Dashboard:

1. Go to **Authentication** → **URL Configuration**
2. Add your reset password URL to **Authorized redirect URIs**:
   ```
   http://localhost:3000/admin/reset-password-confirm
   https://yourdomain.com/admin/reset-password-confirm
   ```

### 3. (Optional) Customize Email Template

In Supabase Dashboard:

1. Go to **Authentication** → **Email Templates**
2. Edit the **Reset Password** template if needed
3. Ensure it contains `{{ .ConfirmationURL }}` variable

## API Endpoints

### POST `/api/auth/reset-password`

Sends a password reset email to the provided address.

**Request:**

```json
{
  "email": "admin@example.com"
}
```

**Response:**

```json
{
  "message": "Password reset email sent successfully"
}
```

## Files Added/Modified

- ✅ `/src/app/admin/forgot-password/page.tsx` - Forgot password request form
- ✅ `/src/app/admin/reset-password-confirm/page.tsx` - Password reset confirmation form
- ✅ `/src/app/api/auth/reset-password/route.ts` - API endpoint for sending reset email
- ✅ `/src/app/admin/login/page.tsx` - Updated with "FORGOT?" button link

## Security Features

- ✅ Reset links expire in 1 hour
- ✅ Passwords encrypted in Supabase
- ✅ Email verification required
- ✅ Password must be at least 6 characters
- ✅ Confirmation password validation

## Troubleshooting

### I'm not receiving the reset email

1. Check spam/promotions folder
2. Verify email address is correct
3. Ensure SUPABASE_SERVICE_ROLE_KEY is correctly set
4. Check Supabase logs for email sending errors

### Reset link says "Invalid"

1. Link may have expired (1 hour timeout)
2. Request a new reset link
3. Make sure `NEXT_PUBLIC_APP_URL` is correctly configured

### Can't set new password

1. Ensure passwords match exactly
2. Password must be at least 6 characters
3. Verify internet connection

## Alternative: Direct Password Reset (Admin Only)

If you want to reset password directly in Supabase:

1. Go to Supabase Dashboard
2. Navigate to **Authentication** → **Users**
3. Find your admin user
4. Click the **"...more"** menu
5. Select **Reset Password** (if available)

This will send a reset email directly from Supabase.
