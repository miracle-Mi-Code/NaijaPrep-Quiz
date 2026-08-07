# Render Deployment Guide for NaijaPrep

This guide provides step-by-step instructions for deploying NaijaPrep to Render with both backend API and frontend serving from a single web service.

## Prerequisites

- A [Render.com](https://render.com) account
- Your repository pushed to GitHub
- PostgreSQL database (Render managed or Neon)

## Deployment Steps

### Step 1: Create a PostgreSQL Database on Render

1. Go to [Render Dashboard](https://dashboard.render.com)
2. Click **New +** → **PostgreSQL**
3. Choose a name (e.g., `naijaprep-db`)
4. Select **Free** plan
5. Click **Create Database**
6. Once created, copy the **Internal Database URL** (looks like `postgres://...`)
7. Save this URL - you'll need it in Step 3

**Alternative**: Use [Neon.tech](https://neon.tech) for free PostgreSQL hosting

### Step 2: Initialize Database with Schema & Seed Data

After your PostgreSQL database is created:

1. From your local machine, connect to the production database:
   ```bash
   # Using the PostgreSQL URL from Step 1
   psql "postgres://user:password@host:port/dbname"
   ```

2. Run the schema (creates tables):
   ```bash
   psql -d "your_database_url" -f database/schema.sql
   ```

3. Run the seed data (adds sample quizzes):
   ```bash
   psql -d "your_database_url" -f database/seed.sql
   ```

4. Verify data was loaded:
   ```bash
   psql "your_database_url" -c "SELECT COUNT(*) FROM quizzes;"
   ```

### Step 3: Deploy Backend Web Service to Render

1. Go to [Render Dashboard](https://dashboard.render.com)
2. Click **New +** → **Web Service**
3. Connect your GitHub repository
4. Configure:
   - **Name**: `naijaprep-backend` (or similar)
   - **Runtime**: Node
   - **Build Command**: `npm install && npm run build`
   - **Start Command**: `npm start`
   - **Root Directory**: `backend`
5. Add Environment Variables:
   - `NODE_ENV` = `production`
   - `PORT` = `5000`
   - `DATABASE_URL` = (Paste the PostgreSQL URL from Step 1)
   - `JWT_SECRET` = (Let Render generate this automatically, or paste a strong random string)
6. Select **Free** plan
7. Click **Create Web Service**

### Step 4: Verify Deployment

1. Once deployed, you'll see a URL like `https://naijaprep-backend.onrender.com`
2. Test the API:
   ```bash
   curl https://naijaprep-backend.onrender.com/api/health
   ```
   You should see: `{"status":"ok","timestamp":"..."}`

3. Test the frontend by visiting `https://naijaprep-backend.onrender.com` in your browser

---

## Troubleshooting

### Issue: "Error message instead of expected behavior"

#### 1. Check Frontend Build
- In Render Dashboard, go to your service → **Logs**
- Look for "Build completed successfully" message
- If build failed, you'll see errors in the logs

**Solution**: Ensure `npm run build` succeeds locally:
```bash
cd frontend
npm install
npm run build
```

#### 2. Check API Connection
- Open browser DevTools (F12) → **Network** tab
- Look for failed requests to `/api/*`
- Check the error message

**Common causes**:
- DATABASE_URL not set or incorrect
- JWT_SECRET not configured
- Database schema not initialized

#### 3. Check Database Connection
- In Render Logs, look for:
  - ✅ `PostgreSQL connection established` (good)
  - ❌ `DATABASE_URL environment variable is not set!` (need to set it)
  - ❌ `Unexpected PostgreSQL client error` (wrong connection string)

**Solution**: 
- Go to your Render Web Service settings
- Click **Environment**
- Verify `DATABASE_URL` is set correctly
- Click **Save Changes** to redeploy

#### 4. Check Frontend File Serving
- In Render Logs, look for: `Serving static files from: ...`
- If you see: `⚠️ WARNING: Public directory not found`, the build failed

**Solution**:
```bash
# Run build locally to debug
cd backend
npm install
npm run build

# Check if public directory was created
ls -la public/
```

### Issue: "Cannot GET /" (blank page)

**Solution**: 
1. Verify public directory was built: `ls -la backend/public/`
2. Check `public/index.html` exists and has correct script tags
3. Redeploy the service

### Issue: API calls return 500 errors

**Solution**:
1. Check if DATABASE_URL is set correctly in Render dashboard
2. Verify database schema was initialized: `psql ... -c "SELECT COUNT(*) FROM quizzes;"`
3. Check Render logs for database connection errors

### Issue: Login/Registration not working

**Solution**:
1. Verify JWT_SECRET is set in Render environment variables
2. Check that users table exists: `psql ... -c "SELECT * FROM users;"`
3. Look for error messages in browser console (F12)

---

## Manual Redeploy

To redeploy after making code changes:

1. Push changes to GitHub
2. Go to Render Dashboard → Your Service
3. Click **Manual Deploy** → **Deploy latest commit**

Or simply push to your connected branch:
```bash
git add .
git commit -m "Fix deployment issues"
git push origin main
```

---

## Environment Variables Reference

| Variable | Value | Required |
|----------|-------|----------|
| `NODE_ENV` | `production` | Yes |
| `PORT` | `5000` | Yes (for Render) |
| `DATABASE_URL` | `postgres://user:pass@host:port/db` | Yes |
| `JWT_SECRET` | Random strong string (Render auto-generates) | Yes |
| `FRONTEND_URL` | Your custom domain (if using) | No |

---

## Performance & Limits (Free Plan)

- 0.5 CPU / 512 MB RAM
- Auto-sleep after 15 min inactivity (cold starts)
- Database auto-pauses after 7 days without activity

For production use, upgrade to paid plan.

---

## Next Steps

- Add custom domain
- Enable automatic deployments on GitHub push
- Monitor logs and performance in Render dashboard
- Backup your PostgreSQL database regularly

