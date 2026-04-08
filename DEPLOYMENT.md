# Deployment (Vercel)

## 1) Environment variables

In Vercel -> Project -> **Settings -> Environment Variables**, add the keys from `.env.example`:

- `VITE_APPWRITE_ENDPOINT`
- `VITE_APPWRITE_PROJECT_ID`
- `VITE_APPWRITE_DATABASE_ID`
- `VITE_APPWRITE_COLLECTION_PROJECTS`
- `VITE_APPWRITE_COLLECTION_EXPERIENCE`
- `VITE_APPWRITE_COLLECTION_ENQUIRIES`
- `VITE_APPWRITE_BUCKET_ID`

## 2) Appwrite settings

In Appwrite -> Project -> **Platforms**, add:

- `http://localhost:5173` (local dev)
- Your Vercel domain (production), e.g. `https://your-project.vercel.app`

Make sure your Database permissions match your intent:

- Projects/Experience: readable by the public (or the site won't load data)
- Enquiries: creatable by the public (or the contact form won't submit)

## 3) Vercel build settings

Vercel should auto-detect Vite, but these values must be correct:

- **Build Command:** `npm run build`
- **Output Directory:** `dist`
- **Install Command:** `npm install` (or `npm ci` if you prefer)

This repo includes `vercel.json` with an SPA rewrite so routes like `/login` and `/admin` work on refresh.
