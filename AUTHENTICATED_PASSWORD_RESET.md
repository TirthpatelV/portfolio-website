# Authenticated Password Reset System

## Overview

The admin password recovery system now uses an **authenticated approach**, preventing unauthorized password resets while maintaining two access methods:

1. **Website Settings Page** (Primary) - Requires login
2. **Supabase Dashboard** (Backup) - For lockout scenarios

## How It Works

### Option 1: Change Password from Dashboard (Primary Method)

**When to use:** Admin is logged in or can still login with old password

**Steps:**

1. Log in to `/admin` with current credentials
2. Click **"Settings"** in the left sidebar
3. Scroll to **"Change Password"** section
4. Enter:
   - Current password (required for security)
   - New password
   - Confirm new password
5. Click **"Update Password"**
6. Success message confirms the change

### Option 2: Reset via Supabase Dashboard (Backup Method)

**When to use:** Admin is completely locked out or forgot password

**Steps:**

1. Go to your **Supabase Dashboard** (https://supabase.com)
2. Navigate to **Authentication** → **Users**
3. Find your admin email address
4. Click the **three dots (⋯)** menu
5. Select **"Reset Password"** (if available)
6. Supabase sends a reset email
7. Click the link in the email and set a new password
8. Login with new password

## Files Created/Modified

✅ **New Files:**

- `/src/app/admin/settings/page.tsx` - Authenticated password change form

✅ **Modified Files:**

- `/src/app/admin/layout.tsx` - Added Settings link to sidebar navigation
- `/src/app/admin/login/page.tsx` - Removed public "FORGOT?" button (commented out)

✅ **Removed Files:**

- `/src/app/admin/forgot-password/page.tsx` - Removed (was public security risk)
- `/src/app/admin/reset-password-confirm/page.tsx` - Removed
- `/src/app/api/auth/reset-password/route.ts` - Removed

## Security Features

✅ **Authenticated Change:**

- Only logged-in admins can change their password
- Current password verification required
- No public access possible

✅ **Password Validation:**

- Minimum 6 characters
- Must confirm new password
- Cannot reuse current password

✅ **Two-Factor Backup:**

- Website form for quick changes
- Supabase direct access for emergencies

## User Experience Flow

```
User Locked Out?
  ├─ Can Still Login
  │   └─ Dashboard → Settings → Change Password
  └─ Completely Locked
      └─ Supabase Dashboard → Reset Password
```

## Setup Requirements

No additional setup needed! The system is ready to use.

### Optional: Email Configuration

- Supabase emails are sent from noreply@supabase.io by default
- To customize, configure your email provider in Supabase Dashboard

## Troubleshooting

### "Current password is incorrect"

- Make sure you're entering the password you used to login

### Can't access the Settings page

- Ensure you're logged into the admin dashboard first
- Check that authentication is working (session valid)

### Locked out completely

1. Use Supabase Dashboard reset method (Option 2)
2. Go to https://supabase.com
3. Navigate to users and reset from there

### Supabase reset email not received

1. Check spam/promotions folder
2. Verify email address is correct
3. Try resetting again after a few minutes
4. Check Supabase logs for errors

## Why This Approach?

**Before:** Public "Forgot Password" form (Security Risk)

- Anyone could reset admin password with email
- No verification of admin identity
- Potential for unauthorized access

**Now:** Authenticated-Only (Secure)

- Only logged-in users can change password
- Current password verification required
- Public cannot access reset form
- Backup Supabase method for emergencies

## Migration Notes

If you had previously shared the "forgot password" link, please note:

- That public link is no longer available
- Use authenticated form in Settings instead
- Or use Supabase backup method if needed

---

**Question?** Check the admin Settings page for a quick reference guide on password reset procedures.
