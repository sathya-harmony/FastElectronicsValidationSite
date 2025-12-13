# Supabase & Vercel Deployment Roadmap

This guide provides a step-by-step roadmap to connecting your application to Supabase and deploying it to Vercel.

## Phase 1: Supabase Setup (Database)

1.  **Create Account**: Go to [Supabase](https://supabase.com/) and sign up.
2.  **New Project**: Create a new project. Give it a name and a strong database password (save this password!).
3.  **Get Connection String**:
    *   Go to **Project Settings** (gear icon) -> **Database** -> **Connection string**.
    *   Select **Node.js**.
    *   Copy the string. It looks like: `postgresql://postgres:[YOUR-PASSWORD]@db.xyz.supabase.co:5432/postgres`
    *   **Crucial**: Use port `6543` (Transaction Pooler) if available for better performance in serverless, otherwise `5432` works too.
4.  **Configure Local Environment**:
    *   Open the `.env` file in your project root.
    *   Paste the connection string into `DATABASE_URL`. Replace `[YOUR-PASSWORD]` with your actual password.
5.  **Push Schema**:
    *   Run the command: `npm run db:push`
    *   This creates all the necessary tables (products, users, etc.) in your Supabase database.

## Phase 2: Vercel Setup (Hosting)

1.  **Push to Git**: Ensure your code is pushed to a GitHub, GitLab, or Bitbucket repository.
2.  **Import to Vercel**:
    *   Go to [Vercel](https://vercel.com/new).
    *   Import your repository.
3.  **Configure Project**:
    *   **Framework Preset**: Select **Vite**.
    *   **Root Directory**: `.` (default).
    *   **Build Command**: `vite build` (default).
    *   **Output Directory**: `dist/public` (Important: this matches our `vercel.json` config).
4.  **Environment Variables**:
    *   Add the following variables in the "Environment Variables" section:
        *   `DATABASE_URL`: Your Supabase connection string (same as in your `.env`).
        *   `ADMIN_PASSWORD`: A secure password for accessing the admin dashboard.
        *   `VITE_GOOGLE_MAPS_API_KEY`: Your Google Maps API Key (must have Maps JavaScript API enabled).
5.  **Deploy**: Click **Deploy**.

## Phase 3: Verification

1.  **Visit URL**: Once deployed, visit your Vercel URL.
2.  **Test API**: Go to `/api/stores` in your browser. You should see a JSON response (likely empty array if no data).
3.  **Admin Access**: Go to `/admin/login` or test the admin flow if you have a UI for it.

## Troubleshooting

*   **Build Fails**: Check the logs. If it mentions missing modules, ensure `package.json` has all dependencies.
*   **Database Error**: "Connection terminated" usually means incorrect `DATABASE_URL` or IP restrictions. Supabase allows all IPs by default, but verify under **Network Restrictions**.
*   **Missing Styles**: Ensure `dist/public` is correctly served and Tailwind processed (built automatically by `npm run build`).
