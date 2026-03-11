# Image Upload Feature Implementation

## Overview

Added comprehensive image upload functionality to the admin dashboard with proper loading skeletons for both admin forms and public pages.

## Components Created

### 1. **ImageUploader Component** (`src/components/ImageUploader.tsx`)

A reusable image input component with:

- **Toggle between URL and Upload modes** - Admins can paste URLs or upload files
- **Image preview** - Shows preview of selected image
- **Loading skeleton** - Smooth gradient animation while image loads
- **File validation** - Checks file type (images only) and size (max 5MB)
- **Upload handling** - Integrates with existing `/api/upload` endpoint
- **Clear button** - Easy way to remove/change image

**Props:**

- `value` - Current image URL
- `onChange` - Callback when image URL changes
- `label` - Field label
- `placeholder` - URL placeholder text
- `folder` - Supabase folder name (default: 'project-images')
- `required` - Mark as required field
- `labelClass` & `inputClass` - Styling props for consistency

### 2. **ImageSkeleton Component** (`src/components/ImageSkeleton.tsx`)

A reusable skeleton loader for images with:

- **Gradient animation** - Smooth loading effect
- **Aspect ratio variants** - Supports square, video (16:9), and auto
- **Dark mode support** - Adapts to theme
- **Customizable className** - Easy to style

## Updated Pages

### Admin Pages

#### 1. **Admin Projects** (`src/app/admin/projects/page.tsx`)

- Replaced "Cover Image URL" input with `ImageUploader`
- Image folder: `project-images`
- Admins can now upload or paste URL for project cover

#### 2. **Admin Blog** (`src/app/admin/blog/page.tsx`)

- Replaced "Featured Image URL" input with `ImageUploader`
- Image folder: `blog-images`
- Admins can upload or paste URL for article featured image

### Public Pages

#### 1. **Public Blog** (`src/app/(public)/blog/page.tsx`)

- Added image loading state tracking
- Featured post image shows gradient skeleton while loading
- Grid post images show skeleton loaders
- Smooth opacity transitions when images load
- No jerky appearance

#### 2. **Public Projects** (`src/app/(public)/projects/page.tsx`)

- Already had good image loading with ProjectImage component
- Enhanced imports for consistency

## How It Works

### For Admin (Uploading Images)

1. Click "URL" tab or "Upload" tab in image field
2. **URL Mode**: Paste image URL from anywhere
3. **Upload Mode**: Click to upload file from computer
   - File is automatically uploaded to Supabase Storage
   - URL is set automatically
   - Preview shows while loading
4. Image appears with skeleton loader while fetching
5. Clear button available to remove image
6. Submit form as usual

### For Users (Viewing Images)

1. When visiting blog or projects pages
2. Images show gradient skeleton loader while downloading
3. Once loaded, image fades in smoothly
4. No jerky transitions or loading artifacts

## File Upload Details

- **Endpoint**: `/api/upload` (existing)
- **Max file size**: 5MB
- **Allowed types**: All image formats (JPEG, PNG, WebP, GIF, etc.)
- **Folders**:
  - `project-images/` - Project cover images
  - `blog-images/` - Blog featured images
- **Storage**: Supabase Storage bucket "portfolio"
- **Validation**: File type and size checked both client and server

## Styling & Consistency

- Uses existing Tailwind classes from your codebase
- Dark mode fully supported
- Matches current admin dashboard aesthetic
- Loading skeleton uses smooth gradient animation
- Responsive design for mobile and desktop

## Usage Example

```tsx
<ImageUploader
  value={formData.image}
  onChange={(url) => setFormData({ ...formData, image: url })}
  label="Cover Image *"
  placeholder="https://..."
  folder="project-images"
  required={true}
  labelClass={labelClass}
  inputClass={inputClass}
/>
```

## Benefits

✅ **Two options** - URL paste or file upload flexibility
✅ **Smooth UX** - Gradient skeleton loaders prevent jerkiness
✅ **Reusable** - ImageUploader can be used anywhere
✅ **Validated** - File type and size validation
✅ **Responsive** - Works on mobile and desktop
✅ **Dark mode** - Full dark theme support
✅ **Accessible** - Clear labels and states
