# PIN Setup - 500 Error Troubleshooting

## ❌ Common Cause: Database Table Missing

### Quick Fix:

1. **Open Supabase Dashboard**
   - Go to https://app.supabase.com
   - Select your project

2. **Run the Migration**
   - Click **SQL Editor** → **New Query**
   - Copy & paste the entire `ADMIN_RECOVERY_MIGRATION.sql` file
   - Click **Run**
   - You should see: "Success. No rows returned"

3. **Verify Table Created**
   - Go to **Table Editor**
   - You should see `admin_recovery` in the list
   - Click it to view the structure

4. **Try PIN Setup Again**
   - Go to `/admin/settings`
   - Scroll to "Security PIN"
   - Enter PIN code
   - Click "Update Security PIN"

---

## ❌ Alternative Cause: Missing Environment Variable

### Check SUPABASE_SERVICE_ROLE_KEY

1. Open `.env.local` in your project root
2. Look for: `SUPABASE_SERVICE_ROLE_KEY=`
3. If missing, get it from Supabase:
   - Dashboard → **Project Settings**
   - Go to **API** tab
   - Under "Project API keys", find **Service role key**
   - Copy the full key
   - Add to `.env.local`:
     ```
     SUPABASE_SERVICE_ROLE_KEY=eyJhbGc...
     ```
4. **Restart dev server** (Ctrl+C, then `npm run dev`)
5. Try PIN setup again

---

## 🔍 Debug Mode: Check Error Details

1. Open browser **DevTools** (F12)
2. Go to **Console** tab
3. Try PIN setup again
4. Look for detailed error message:
   - "Server configuration error" → Check SUPABASE_SERVICE_ROLE_KEY
   - "Table may not exist" → Run migration in Supabase
   - Other error → See terminal output

---

## 🖥️ Check Terminal Output

Your dev server terminal should show the error. Look for:

```
Set PIN error: [error details]
```

Common errors:

- **"relation "admin_recovery" does not exist"** → Run migration
- **"permission denied"** → Check service role key
- **"SUPABASE_SERVICE_ROLE_KEY not configured"** → Add to .env.local

---

## ✅ Verification Steps

After running migration:

1. In Supabase **Table Editor**, click on `admin_recovery`
2. Check columns exist:
   - ✅ email (text, primary key)
   - ✅ pin (text)
   - ✅ created_at (timestamp)
   - ✅ updated_at (timestamp)
3. Check RLS is enabled:
   - Click **Row Level Security** tab
   - Should see 3 policies:
     - allow_pin_verification
     - allow_user_update_own_pin
     - allow_user_insert_own_pin

---

## 🚀 Quick Setup Sequence

```
1. Run migration in Supabase SQL Editor
2. Verify SUPABASE_SERVICE_ROLE_KEY in .env.local
3. Restart dev server with: npm run dev
4. Go to /admin/settings
5. Set your PIN
6. Check console for success message
```

---

## 📝 If Issues Persist

Check these in order:

1. Migration SQL completed without errors?
2. Table `admin_recovery` exists in Table Editor?
3. `.env.local` has SUPABASE_SERVICE_ROLE_KEY?
4. Dev server restarted after env change?
5. Browser cache cleared?
6. Logged in as authenticated user (not anonymous)?

---

Come back with error details from terminal/console if still having issues!
