# Admin PIN Recovery System Setup Guide

This document provides step-by-step instructions for setting up and testing the 4-digit PIN password recovery system.

## 🔐 System Overview

The Admin PIN Recovery System provides two ways for admins to reset their password:

1. **Authenticated Password Change** (Settings Page)
   - For logged-in admins who know their current password
   - Access via `/admin/settings`

2. **PIN-Based Password Reset** (Forgot Password Flow)
   - For locked-out admins who forgot their password
   - Use email + 4-digit PIN to verify identity
   - Access via `/admin/forgot-password-pin`

3. **Backup Recovery** (Last Resort)
   - Step-by-step Supabase recovery guide
   - Access via `/admin/recovery`

---

## ✅ Prerequisites

- Next.js development server running
- Supabase project set up with admin user
- Environment variables configured (SUPABASE_SERVICE_ROLE_KEY)

---

## 📋 Setup Steps

### Step 1: Create the Database Table

1. Go to [Supabase Dashboard](https://app.supabase.com)
2. Select your project
3. Navigate to **SQL Editor**
4. Click **New Query**
5. Copy and paste the contents of `ADMIN_RECOVERY_MIGRATION.sql`
6. Click **Run**

The migration creates:

- `admin_recovery` table with email (primary key), pin, created_at, updated_at
- Row-level security (RLS) policies
- Indexes for fast queries

**Error Prevention:**

- If you get "relation does not exist" on the first run, that's normal - the table will be created
- The migration is idempotent (safe to run multiple times)

### Step 2: Set Your Admin PIN (First Time)

1. **Log in** to `/admin/login` with your existing credentials
2. Navigate to `/admin/settings`
3. Scroll to **"Security PIN (For Password Recovery)"** section
4. Enter a 4-digit PIN code
5. Confirm the PIN
6. Click **"Update Security PIN"**
7. You should see: "PIN Updated! Your security PIN has been saved securely."

✅ **Your PIN is now set up!**

### Step 3: Test the PIN-Based Password Reset

#### Option A: Test Without Logging Out (Recommend First)

1. Open a **private/incognito browser window**
2. Go to `/admin/forgot-password-pin`
3. Enter your **admin email**
4. Enter the **4-digit PIN** you just set
5. Click **"Verify PIN"**
6. If PIN is correct, you'll see a password reset form
7. Enter a new strong password:
   - At least 6 characters
   - Must contain uppercase, lowercase, and number
8. Confirm the password
9. Click **"Reset Password"**
10. You should see: "Password Reset Successfully!"
11. Click **"Back to Login"**
12. Try logging in with your **new password**

**Success Indicators:**

- ✅ Can verify PIN with correct email + PIN combination
- ✅ Password form appears after verification
- ✅ Can set new password with validation
- ✅ Can log in with new password

#### Option B: Test Full Logout Flow

1. Log out from `/admin`
2. Go to `/admin/login`
3. Look for **"LOCKED OUT?"** button
4. Click it (redirects to `/admin/forgot-password-pin`)
5. Proceed with PIN reset as described above

---

## 🔧 Configuration & Customization

### Change the PIN Length

If you want to require a different PIN length (e.g., 6 digits instead of 4):

1. **Frontend** (`/src/app/admin/forgot-password-pin/page.tsx`):
   - Change `maxLength={4}` to `maxLength={6}` on PIN input
   - Update validation: `if (pin.length !== 4)` → `if (pin.length !== 6)`
   - Update placeholder text from "0000" to "000000"

2. **API** (`/src/app/api/auth/verify-pin/route.ts`):
   - Update: `if (pin.length !== 4)` → `if (pin.length !== 6)`
   - Update regex: `/^\d{4}$/` → `/^\d{6}$/`
   - Update validation error messages

3. **Settings Page** (`/src/app/admin/settings/page.tsx`):
   - Same changes as frontend form

### Add PIN Hashing (Security Enhancement)

Currently, PINs are stored in plain text. For production:

1. Install bcryptjs:

   ```bash
   npm install bcryptjs
   ```

2. Update `/src/app/api/admin/set-pin/route.ts`:

   ```typescript
   import bcrypt from "bcryptjs";

   // When saving PIN:
   const hashedPin = await bcrypt.hash(pin, 10);
   ```

3. Update `/src/app/api/auth/verify-pin/route.ts`:

   ```typescript
   import bcrypt from 'bcryptjs';

   // When verifying PIN:
   const isMatch = await bcrypt.compare(pin, data.pin);
   if (!isMatch) {
     return NextResponse.json(...);
   }
   ```

### Rate Limiting (Security Enhancement)

To prevent brute force PIN guessing:

1. Create a `pin_attempts` table:

   ```sql
   CREATE TABLE IF NOT EXISTS public.pin_attempts (
     id BIGINT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
     email TEXT NOT NULL,
     attempt_count INT DEFAULT 1,
     last_attempt_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
     reset_at TIMESTAMP WITH TIME ZONE
   );
   ```

2. In verify-pin endpoint:
   - Check if user has exceeded 5 attempts
   - Increment attempt counter on failed PIN
   - Lock out for 15 minutes after 5 failed attempts

---

## 🧪 Testing Checklist

- [ ] **Database table created** in Supabase
- [ ] **PIN setting works** in Settings page
- [ ] **PIN verification works** in forgot password flow
- [ ] **Password reset works** after PIN verification
- [ ] **New password allows login**
- [ ] **"LOCKED OUT?" button** appears on login page
- [ ] **Recovery page** displays without errors
- [ ] **Form validation** shows real-time errors
- [ ] **Password requirements** display correctly
- [ ] **Dark mode** works on all recovery pages

---

## 🐛 Troubleshooting

### "Entity not found" error when setting PIN

**Problem:** PIN setting fails with "Entity not found"

**Solutions:**

1. Verify `admin_recovery` table exists in Supabase:
   - Go to Tables → Check if `admin_recovery` is listed
   - If missing, run the migration again

2. Check SUPABASE_SERVICE_ROLE_KEY:
   - Verify it's set in `.env.local`
   - Should be a long base64-encoded key from Supabase Project Settings → API Keys

3. Check RLS policies:
   - Go to Table Editor → admin_recovery → RLS
   - Verify policies are enabled

### PIN verification always fails

**Problem:** "Invalid email or PIN" even with correct PIN

**Solutions:**

1. Verify PIN was actually saved:
   - In Supabase Table Editor, view `admin_recovery` table
   - Check if your email and PIN are stored

2. Check email case sensitivity:
   - PIN reset converts email to lowercase
   - Make sure email in table matches format

3. Check API response:
   - Open browser DevTools → Network tab
   - Call verify-pin endpoint, check response
   - Look for error messages

### "Password updated successfully" but still can't log in

**Problem:** PIN reset says success, but old password still works

**Solutions:**

1. Verify password was updated:
   - In Supabase, go to Authentication → Users
   - Click refresh icon
   - Check "Password Updated" timestamp

2. Clear browser cache:
   - Ctrl+Shift+Delete or Cmd+Shift+Delete
   - Clear authenticated sessions

3. Check password strength:
   - Password must have uppercase, lowercase, and number
   - Check browser console for validation errors

### Rate limiting: "2 emails per hour"

**Problem:** Forgot password emails arrive rate-limited

**Context:** This is Supabase's built-in rate limit, not our system

**Workaround:**

- Use PIN reset flow instead (no email required!)
- OR wait 1 hour for email quota to reset
- OR contact Supabase support to increase limits

---

## 📝 File Manifest

New/Modified Files:

- **ADMIN_RECOVERY_MIGRATION.sql** - Database table and RLS setup
- **src/app/admin/settings/page.tsx** - PIN setup form added
- **src/app/admin/forgot-password-pin/page.tsx** - PIN-based password reset flow
- **src/app/api/admin/set-pin/route.ts** - Save PIN to database
- **src/app/api/auth/verify-pin/route.ts** - Verify PIN for password reset
- **src/app/api/auth/reset-password-with-pin/route.ts** - Update password after PIN verification

---

## 🔒 Security Notes

1. **PINs are stored unencrypted** - Consider adding bcrypt hashing in production
2. **No rate limiting** - Consider adding rate limiting after 5 failed attempts
3. **No audit logging** - Consider logging PIN verification attempts
4. **Email case-insensitive** - PINs are stored with lowercased emails
5. **No PIN expiration** - PIN remains valid indefinitely (consider adding expiration)

---

## 📞 Support

If you encounter issues:

1. Check browser console for JavaScript errors
2. Check Network tab for API errors
3. Review server logs in terminal
4. Verify Supabase environment variables are set
5. Ensure migrations ran successfully

---

## ✨ Next Steps

After setup, consider:

- Adding email verification for PIN reset confirmation
- Implementing PIN hashing with bcryptjs
- Adding rate limiting and attempt logging
- Creating admin audit logs for password changes
- Setting up 2FA for additional security
- Add PIN expiration (e.g., change every 90 days)
