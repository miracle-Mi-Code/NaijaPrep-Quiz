# 🚨 Render Dashboard Checklist - CRITICAL FIX

Your error "Frontend served separately in dev mode" is happening because **NODE_ENV is not being set in your Render dashboard**.

## ✅ REQUIRED: Render Dashboard Configuration

1. **Go to your Render service dashboard**: https://dashboard.render.com

2. **Click on your service** (e.g., "naijaprep-backend")

3. **Navigate to Environment tab**

4. **VERIFY these environment variables are set** (if missing, add them):

| Key | Value | Status |
|-----|-------|--------|
| `NODE_ENV` | `production` | ⚠️ **MUST BE SET** |
| `PORT` | `5000` | Must be set |
| `DATABASE_URL` | `postgres://...` | Must be set (from Neon/Render) |
| `JWT_SECRET` | (auto-generated) | Let Render generate or paste secure random |

## ⚠️ Why You're Seeing the Error

The message `"Frontend served separately in dev mode"` means:
- ✗ NODE_ENV is NOT set to "production"
- ✗ The code thinks it's in development mode
- ✗ It won't serve the built React frontend
- ✗ You only get the API

**EVEN THOUGH** the frontend files ARE in `backend/public/` and built correctly!

## 🔧 FIX (Do This Now)

### Step 1: Add/Update Environment Variables
```
In Render Dashboard:
1. Go to Environment
2. Add or update these keys:
   - NODE_ENV = production
   - DATABASE_URL = your postgres URL
   - JWT_SECRET = strong random string
3. Click "Save & Deploy"
```

### Step 2: Redeploy
```
Render Dashboard → Manual Deploy → Deploy latest commit
```

### Step 3: Verify
After deployment completes, visit your Render URL and you should see:
- ✅ The NaijaPrep login page (React frontend)
- NOT the error message

---

## 📋 If Still Not Working

### Check Render Logs:
1. Go to your service → **Logs** tab
2. Look for this line:
   - ✅ `✅ Serving React frontend from: ...` → Frontend is serving (GOOD)
   - ✗ `⚠️  WARNING: Frontend not found` → Build failed (rebuild)

### Common Issues:

**Issue 1: Build Failed**
- Check Logs for build errors
- Run locally: `cd backend && npm install && npm run build`
- Ensure `frontend/package.json` exists

**Issue 2: DATABASE_URL Not Set**
- API calls will fail with database errors
- Set DATABASE_URL in Render Environment

**Issue 3: Still Seeing Error After Deploy**
- Wait 2-3 minutes for Render to fully deploy
- Hard refresh browser (Ctrl+Shift+R or Cmd+Shift+R)
- Check browser DevTools → Network tab for actual responses

---

## ✅ Final Check

Your deployment is **working correctly** when you see:

1. **Frontend loads** - React app with login screen
2. **API works** - Login/registration functions
3. **Database works** - Can create account and take quizzes

If you see the JSON error message, **you're missing environment variables in Render dashboard**.

---

## 💡 Pro Tip
- Render dashboard env vars OVERRIDE render.yaml
- Always double-check Render Dashboard for your actual deployed settings
- render.yaml is just a template for reference
