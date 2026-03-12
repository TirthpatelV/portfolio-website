# 🚀 COMPLETE Portfolio Website Setup Guide (FRIEND'S LAPTOP)

A comprehensive step-by-step guide to clone, set up, customize, and deploy your own portfolio website on your laptop with Supabase and Vercel.

---

## 📋 Table of Contents
1. [Prerequisites](#prerequisites)
2. [Clone the Project](#clone-the-project)
3. [Supabase Setup](#supabase-setup)
4. [Database Configuration](#database-configuration)
5. [Environment Variables](#environment-variables)
6. [Run Locally](#run-locally)
7. [Admin Panel Setup](#admin-panel-setup)
8. [Customize Your Portfolio](#customize-your-portfolio)
9. [Deploy to Vercel](#deploy-to-vercel)
10. [Custom Domain & Email](#custom-domain--email)
11. [Features & Structure](#features--structure)
12. [Troubleshooting](#troubleshooting)

---

## Prerequisites

Before starting, ensure you have:
- ✅ **Node.js 18+** ([Download](https://nodejs.org/))
- ✅ **npm** (comes with Node.js)
- ✅ **Git** ([Download](https://git-scm.com/))
- ✅ **Supabase Account** (free at [supabase.com](https://supabase.com))
- ✅ **Vercel Account** (free at [vercel.com](https://vercel.com))
- ✅ **GitHub Account** (free at [github.com](https://github.com))
- ✅ **Text Editor** (VS Code recommended)

---

## Clone the Project

Open Terminal/Command Prompt and run:

```bash
# Navigate to where you want the project
cd Desktop

# Clone the repository
git clone https://github.com/Harmin30/portfolio-website.git

# Go into the project
cd portfolio-website

# Install all dependencies
npm install

# Start the development server
npm run dev
```

Visit `http://localhost:3000` to see the portfolio (it will load empty because you don't have data yet).

---

## Supabase Setup

### Step 1: Create a Supabase Project

1. Go to [supabase.com](https://supabase.com)
2. Click **"Sign Up"** or **"Sign In"**
3. Click **"New Project"**
4. Fill in:
   - **Project Name**: `portfolio-website` (or your name)
   - **Database Password**: Create a strong password (save it!)
   - **Region**: Choose closest to your location
5. Click **"Create new project"** and wait 1-2 minutes

### Step 2: Get Your API Keys

1. In Supabase dashboard, go to **Settings** (bottom left) → **API**
2. You'll see:
   - **Project URL** (example: `https://xxxxx.supabase.co`)
   - **Anon Key** (safe to expose publicly)
   - **Service Role Key** (KEEP SECRET!)

**Save these three keys** - you'll need them soon!

### Step 3: Create Storage Bucket for Images

1. Click **"Storage"** in the left sidebar
2. Click **"Create a new bucket"**
3. Name it: `portfolio`
4. Toggle **"Public bucket"** ON (so images show publicly)
5. Click **"Create bucket"**

### Step 4: Set Storage Permissions

1. Click on the **"portfolio"** bucket
2. Click **"Policies"** tab
3. Click **"New Policy"** → **"For INSERT"**
4. Select **"With custom template"**
5. Replace the condition with:
```sql
(auth.role() = 'authenticated'::text OR auth.role() = 'anon'::text)
```
6. Click **"Review"** → **"Save policy"**

---

## Database Configuration

### Run Setup SQL

1. In Supabase, click **"SQL Editor"**
2. Click **"New Query"**
3. Copy and paste this entire SQL script:

```sql
-- ========================================
-- Create All Tables
-- ========================================

-- Profiles (Basic site info)
CREATE TABLE profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  bio TEXT,
  profile_photo TEXT,
  resume_link TEXT,
  github_url TEXT,
  linkedin_url TEXT,
  twitter_url TEXT,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- About (Extended bio & timeline)
CREATE TABLE about (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  about_text TEXT,
  profile_photo TEXT,
  resume_link TEXT,
  education JSONB DEFAULT '[]'::jsonb,
  experience JSONB DEFAULT '[]'::jsonb,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Projects (Portfolio projects)
CREATE TABLE projects (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  description TEXT,
  image TEXT,
  tech_stack TEXT[],
  github_url TEXT,
  live_url TEXT,
  display_order INT DEFAULT 0,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Blog Posts
CREATE TABLE blog_posts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  excerpt TEXT,
  content TEXT,
  image TEXT,
  published_at TIMESTAMP,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Skills (By category)
CREATE TABLE skills (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  category TEXT NOT NULL,
  level TEXT DEFAULT 'intermediate',
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Certifications
CREATE TABLE certificates (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  issuer TEXT NOT NULL,
  description TEXT,
  date_obtained DATE,
  certificate_url TEXT,
  is_featured BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Contact Form Messages
CREATE TABLE messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  message TEXT NOT NULL,
  read BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT NOW()
);

-- ========================================
-- Enable Row Level Security (RLS)
-- ========================================
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE about ENABLE ROW LEVEL SECURITY;
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE blog_posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE skills ENABLE ROW LEVEL SECURITY;
ALTER TABLE certificates ENABLE ROW LEVEL SECURITY;
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;

-- ========================================
-- Create RLS Policies (Public Read)
-- ========================================
CREATE POLICY "profiles_read" ON profiles FOR SELECT USING (true);
CREATE POLICY "about_read" ON about FOR SELECT USING (true);
CREATE POLICY "projects_read" ON projects FOR SELECT USING (true);
CREATE POLICY "blog_posts_read" ON blog_posts FOR SELECT USING (true);
CREATE POLICY "skills_read" ON skills FOR SELECT USING (true);
CREATE POLICY "certificates_read" ON certificates FOR SELECT USING (true);
CREATE POLICY "messages_insert" ON messages FOR INSERT WITH CHECK (true);
```

4. Click **"Execute"** and wait for success message

---

## Environment Variables

### Create `.env.local` File

In your project root folder (same level as `package.json`), create a file named `.env.local`:

```bash
# On Mac/Linux:
touch .env.local

# On Windows:
# Just create a text file and name it `.env.local`
```

### Add Configuration

Open `.env.local` in a text editor and paste:

```env
# ========================================
# SUPABASE (REQUIRED - from Step 2)
# ========================================
NEXT_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...

# ========================================
# EMAIL (Choose One Option)
# ========================================

# Option A: Resend (Easiest - Recommended)
RESEND_API_KEY=re_xxxxxxxxxxxxxxxxxxxx
RESEND_FROM_EMAIL=noreply@yourdomain.com

# Option B: Gmail (Alternative)
GMAIL_USER=your.email@gmail.com
GMAIL_APP_PASSWORD=xxxx xxxx xxxx xxxx

# ========================================
# DEPLOYMENT
# ========================================
NEXT_PUBLIC_APP_URL=http://localhost:3000

# For production, change to:
# NEXT_PUBLIC_APP_URL=https://yourdomain.com

# ========================================
# PORTFOLIO (Optional - Customizable)
# ========================================
NEXT_PUBLIC_PORTFOLIO_NAME=Your Name
NEXT_PUBLIC_PORTFOLIO_TITLE=Full Stack Developer
NEXT_PUBLIC_PORTFOLIO_EMAIL=your.email@example.com
NEXT_PUBLIC_PORTFOLIO_GITHUB=https://github.com/yourname
NEXT_PUBLIC_PORTFOLIO_LINKEDIN=https://linkedin.com/in/yourname
NEXT_PUBLIC_PORTFOLIO_TWITTER=https://twitter.com/yourname

# ========================================
# ENVIRONMENT
# ========================================
NODE_ENV=development
```

### Get Your Keys

**Supabase Keys:**
1. Supabase Dashboard → Settings → API
2. Copy your Project URL and Anon Key
3. Also copy Service Role Key (keep it secret!)

**Resend API (Optional - for contact emails):**
1. Go to [resend.com](https://resend.com)
2. Sign up
3. Click "API Keys"
4. Create new key
5. Copy the key

**Gmail (Alternative email - Optional):**
1. Log into Gmail
2. Enable 2-Step Verification if not done
3. Go to [myaccount.google.com/apppasswords](https://myaccount.google.com/apppasswords)
4. Select Mail → Windows Computer (or your device)
5. Copy the 16-character password (remove spaces)

---

## Run Locally

```bash
# Make sure you're in the portfolio-website folder
cd portfolio-website

# Install dependencies (if not done yet)
npm install

# Start development server
npm run dev
```

Open `http://localhost:3000` in your browser!

You should see:
- ✅ Home page
- ✅ Navigation menu
- ✅ Empty sections (because no data yet)

---

## Admin Panel Setup

### Set UP PIN

1. Go to `http://localhost:3000/admin`
2. You'll see **"Set UP PIN"** button
3. Click it and create a **4-digit PIN** (e.g., 1234)
4. **Remember your PIN!**

### Login to Admin

1. Go to `http://localhost:3000/admin`
2. Enter your PIN
3. You're in the admin dashboard!

### Forgot PIN?

1. Click **"Forgot PIN"** on the login page
2. Complete the recovery process
3. Set a new PIN

---

## Customize Your Portfolio

### Add Your Profile

1. Admin → **Profile**
2. Add:
   - Your name
   - Your bio
   - Your photo
   - Resume link (URL to PDF)
   - Social links (GitHub, LinkedIn, Twitter)
3. Click **"Save Profile"**

### Add Projects

1. Admin → **Projects**
2. Click **"+ New Project"**
3. Fill in:
   - **Title**: Project name
   - **Description**: What it does (will be fully shown now!)
   - **Image**: Upload a screenshot
   - **Tech Stack**: Technologies used (comma-separated)
   - **GitHub URL**: Link to repository
   - **Live URL**: Link to live site (if available)
   - **Display Order**: Priority (1 = first)
4. Click **"Save Project"**

### Write Blog Posts

1. Admin → **Blog**
2. Click **"+ New Post"**
3. Fill in:
   - **Title**: Post title
   - **Slug**: URL-safe name (auto-generated from title)
   - **Excerpt**: Summary shown in list
   - **Content**: Full post content (Markdown supported)
   - **Image**: Featured image
   - **Published**: Toggle to publish
4. Click **"Save Post"**

### Add Skills

1. Admin → **Skills**
2. Select a **Category**: Frontend / Backend / Database / Tools
3. Click **"+ Add Skill"**
4. Fill in:
   - **Name**: Skill name (e.g., "React", "TypeScript")
   - **Level**: Beginner / Intermediate / Advanced
5. Click **"Save"**

### Add Certifications

1. Admin → **Certificates**
2. Click **"+ New Certificate"**
3. Fill in:
   - **Title**: Certificate name
   - **Issuer**: Organization (e.g., "Google", "AWS")
   - **Description**: Details about certification
   - **Date Obtained**: When you earned it
   - **Certificate URL**: Link to verify certificate
   - **Featured**: Toggle to show at top
4. Click **"Save"**

### Update About Section

1. Admin → **About**
2. Add:
   - **About Text**: Your full biography
   - **Profile Photo**: Your picture
   - **Resume Link**: URL to your resume PDF
   - **Education**: Add entries with Year, Degree, School
   - **Experience**: Add entries with Year, Title, Company
3. Click **"Save About"**

### Manage Messages

1. Admin → **Messages**
2. View all contact form submissions
3. Mark as read/unread
4. Delete messages

---

## Deploy to Vercel

### Step 1: Push to Your Own GitHub

```bash
# Configure Git with your details
git config user.name "Your Name"
git config user.email "your.email@example.com"

# Remove the original remote
git remote remove origin

# Add YOUR GitHub repository
git remote add origin https://github.com/YOUR_USERNAME/portfolio-website.git

# Push to your GitHub
git add -A
git commit -m "Initial portfolio setup"
git push -u origin main
```

### Step 2: Deploy on Vercel

1. Go to [vercel.com](https://vercel.com)
2. Sign in with GitHub
3. Click **"New Project"**
4. Click **"Import Git Repository"**
5. Paste your GitHub URL
6. Click **"Continue"**

### Step 3: Set Environment Variables

1. In Vercel, you'll see **"Environment Variables"** section
2. Add each variable from your `.env.local`:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `SUPABASE_SERVICE_ROLE_KEY`
   - `RESEND_API_KEY` (if using Resend)
   - `RESEND_FROM_EMAIL` (if using Resend)
   - `NEXT_PUBLIC_APP_URL=https://your-domain.com` (later)
3. Click **"Deploy"**

Done! Your portfolio is now live! 🎉

### Automatic Deployments

Every time you push to GitHub:
```bash
git add -A
git commit -m "Updated portfolio"
git push
```

Vercel automatically redeploys in 2-5 minutes!

---

## Custom Domain & Email

### Add Custom Domain (Optional)

1. Buy a domain from [Namecheap](https://namecheap.com), [GoDaddy](https://godaddy.com), etc.
2. In Vercel: Project Settings → **Domains**
3. Add your domain
4. Follow DNS instructions from Vercel
5. Update `.env` file with new URL for emails to work

### Set Up Email Notifications

Emails are optional. Choose one:

**Option A: Resend (Easiest)**
- Already set up if you added keys in `.env.local`
- Emails go to `RESEND_FROM_EMAIL` address
- Free tier: 100 emails/day

**Option B: Gmail**
- Already set up if you added Gmail keys
- Emails go to `GMAIL_USER` email
- Limited to 100-500 emails/day

**Option C: No Email**
- Messages still saved in Supabase
- View them in Admin → Messages

---

## Features & Structure

### Public Pages (Everyone Can View)
- **Home** (`/`) - Introduction
- **About** (`/about`) - Bio + Resume download
- **Projects** (`/projects`) - Showcase work
- **Blog** (`/blog`) - Articles
- **Skills** (`/skills`) - Tech stack
- **Certificates** (`/certificates`) - Certs
- **Contact** (`/contact`) - Contact form

### Admin Dashboard (PIN Protected)
- **Profile** - Basic info
- **About** - Bio + Timeline
- **Projects** - Manage projects
- **Blog** - Write posts
- **Skills** - Add skills
- **Certificates** - Add certs
- **Messages** - Contact submissions
- **Settings** - Change PIN

### Special Features
✨ Image uploads
✨ Dark/Light mode
✨ Mobile responsive
✨ Smooth animations
✨ SEO optimized

---

## Project Structure

```
portfolio-website/
├── src/
│   ├── app/
│   │   ├── (public)/              # Public pages
│   │   │   ├── page.tsx          # Home page
│   │   │   ├── about/            # About page
│   │   │   ├── projects/         # Projects page
│   │   │   ├── blog/             # Blog page
│   │   │   ├── skills/           # Skills page
│   │   │   └── contact/          # Contact page
│   │   ├── admin/                 # Admin (PIN protected)
│   │   │   ├── login/            # PIN login
│   │   │   ├── profile/          # Edit profile
│   │   │   ├── projects/         # Manage projects
│   │   │   ├── blog/             # Manage posts
│   │   │   └── ... other pages
│   │   ├── api/                   # API routes
│   │   │   ├── profile/          # GET profile
│   │   │   ├── projects/         # Manage projects
│   │   │   ├── upload/           # Image upload
│   │   │   └── ... other routes
│   │   └── layout.tsx            # Root layout
│   ├── components/               # React components
│   ├── lib/                       # Utilities
│   └── types/                     # TypeScript types
├── public/                        # Static files
├── .env.local                    # YOUR variables (create this!)
├── package.json                  # Dependencies
└── tsconfig.json                 # TypeScript config
```

---

## Troubleshooting

### "Cannot connect to Supabase"
**Problem**: Error about Supabase connection
**Solution**:
1. Check `.env.local` has correct URL and keys
2. Make sure `.env.local` is in the root folder
3. Restart dev server: `npm run dev`
4. Check Supabase dashboard is working

### "PIN not working"
**Problem**: Can't log into admin
**Solution**:
1. Clear browser cookies and cache
2. Try incognito/private browsing
3. Use forgot PIN: `/admin/forgot-password-pin`
4. Check console for errors (F12)

### "Can't upload images"
**Problem**: Image upload fails
**Solution**:
1. Make sure "portfolio" bucket exists in Supabase Storage
2. Check storage policies are set
3. Image must be under 10MB
4. Verify `SUPABASE_SERVICE_ROLE_KEY` in `.env.local`
5. Restart: `npm run dev`

### "Modules not found"
**Problem**: `Error: Cannot find module 'react'`
**Solution**:
```bash
rm -rf node_modules package-lock.json
npm install
npm run dev
```

### "Vercel deployment fails"
**Problem**: Build fails on Vercel
**Solution**:
1. Check all env vars are set in Vercel
2. Match exactly with your `.env.local` names
3. Check Vercel build logs (click the deployment)
4. Try redeploying manually
5. Make sure GitHub repo is connected

### "Contact form not sending emails"
**Problem**: Messages not emailed
**Solution**:
1. Check you set `RESEND_API_KEY` or Gmail settings
2. Verify keys are in Vercel environment
3. Check Vercel logs for errors
4. If using Gmail, verify 2-Step is enabled

### "Blog posts not showing"
**Problem**: Blog page is empty
**Solution**:
1. Make sure posts are marked `published=true`
2. Check posts table has data in Supabase
3. Queries might fail if table is empty
4. Add a test post first

### "Dark mode not working"
**Problem**: Can't toggle theme
**Solution**:
1. Check browser supports dark mode
2. Clear browser cache
3. Check browser console for JavaScript errors

---

## Useful Commands

```bash
# Development
npm run dev                  # Start dev server
npm run build              # Build for production
npm start                  # Start production server
npm run lint               # Check for code errors

# Database
# In Supabase dashboard:
# - SQL Editor: Run custom SQL
# - Table Editor: Edit data directly
# - Storage: Manage files

# Deployment
git add -A                 # Stage all changes
git commit -m "message"    # Commit changes
git push                   # Push to GitHub (auto-deploys on Vercel)
```

---

## Security Notes

🔒 **Never share**:
- `.env.local` file
- `SUPABASE_SERVICE_ROLE_KEY`
- Admin PIN
- Gmail app passwords
- Resend API keys

✅ **Keep safe**:
- Use environment variables (not hardcoded)
- Don't commit `.env.local` to Git
- Use `.gitignore` (already configured)
- Enable 2-FA on Supabase & GitHub accounts

---

## Next Steps

1. ✅ Clone repository
2. ✅ Add Supabase keys to `.env.local`
3. ✅ Run `npm install` and `npm run dev`
4. ✅ Create database tables (SQL)
5. ✅ Set admin PIN
6. ✅ Add your profile & content
7. ✅ Push to GitHub
8. ✅ Deploy on Vercel
9. ✅ Test everything
10. ✅ Share your portfolio! 🎉

---

## Getting Help

If you get stuck:
1. Read error message carefully
2. Check console (F12) for details
3. Review this guide again
4. Check Supabase/Vercel dashboards
5. Search Google for error message
6. Ask in Discord/communities
7. Contact the original developer

---

## Quick Reference

| Page | URL | Purpose |
|------|-----|---------|
| Home | `/` | Portfolio intro |
| About | `/about` | Bio + Resume |
| Projects | `/projects` | Project showcase |
| Blog | `/blog` | Articles |
| Skills | `/skills` | Tech stack |
| Certificates | `/certificates` | Certs |
| Contact | `/contact` | Contact form |
| Admin | `/admin` | Dashboard |

---

Good luck with your portfolio! 🚀

Feel free to customize everything to match your style and needs!
