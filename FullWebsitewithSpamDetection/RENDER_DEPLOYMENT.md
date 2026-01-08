# Deploying to Render

This guide will walk you through deploying both the backend and frontend to Render.

## Prerequisites

1. **Render Account**: Sign up at https://render.com (free tier available)
2. **GitHub Repository**: Push your code to GitHub (Render connects via GitHub)
3. **Dataset File**: Ensure `spam mail.csv` is in your repository

---

## Step 1: Prepare Your Repository

1. **Push your code to GitHub** (if not already done):
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git remote add origin <your-github-repo-url>
   git push -u origin main
   ```

2. **Verify these files exist**:
   - `src/backend/app.py`
   - `src/backend/requirements.txt`
   - `src/backend/gunicorn_config.py`
   - `spam mail.csv` (in `FullWebsitewithSpamDetection/` directory)

---

## Step 2: Deploy Backend API

1. **Go to Render Dashboard**: https://dashboard.render.com

2. **Click "New +" → "Web Service"**

3. **Connect your GitHub repository**:
   - Click "Connect account" if not already connected
   - Select your repository
   - Click "Connect"

4. **Configure Backend Service**:
   - **Name**: `spam-detection-backend` (or your preferred name)
   - **Region**: Choose closest to you (e.g., `Oregon`)
   - **Branch**: `main` (or your default branch)
   - **Root Directory**: `FullWebsitewithSpamDetection/src/backend`
   - **Environment**: `Python 3`
   - **Build Command**: 
     ```bash
     chmod +x render_build.sh && ./render_build.sh
     ```
     (This script handles finding and copying the dataset, then training models)
   - **Start Command**: 
     ```bash
     gunicorn app:app --config gunicorn_config.py
     ```
   - **Plan**: `Free` (or choose a paid plan)

5. **Set Environment Variables**:
   Click "Advanced" → "Add Environment Variable":
   - `FLASK_ENV` = `production`
   - `FLASK_DEBUG` = `False`
   - `PYTHONUNBUFFERED` = `1`
   - `PORT` = (Render sets this automatically, but you can set it if needed)

6. **Add Dataset File**:
   - Option A: Ensure `spam mail.csv` is in your repository at `FullWebsitewithSpamDetection/spam mail.csv`
   - Option B: Upload via Render's file system (after deployment, go to Shell and upload)

7. **Click "Create Web Service"**

8. **Wait for deployment** (first build may take 5-10 minutes)

9. **Copy your backend URL** (e.g., `https://spam-detection-backend.onrender.com`)

---

## Step 3: Deploy Frontend

1. **In Render Dashboard, click "New +" → "Static Site"**

2. **Connect your GitHub repository** (same repository)

3. **Configure Frontend Service**:
   - **Name**: `spam-detection-frontend` (or your preferred name)
   - **Region**: Same as backend
   - **Branch**: `main`
   - **Root Directory**: `FullWebsitewithSpamDetection`
   - **Build Command**: 
     ```bash
     npm install && npm run build
     ```
   - **Publish Directory**: `build`
   - **Plan**: `Free`

4. **Set Environment Variables**:
   Click "Environment" → "Add Environment Variable":
   - `VITE_API_URL` = `https://your-backend-url.onrender.com`
     (Use the backend URL you copied in Step 2)

5. **Click "Create Static Site"**

6. **Wait for deployment** (usually 2-5 minutes)

7. **Your frontend will be live!** (e.g., `https://spam-detection-frontend.onrender.com`)

---

## Step 4: Verify Deployment

1. **Test Backend**:
   - Visit: `https://your-backend-url.onrender.com/api/health`
   - Should return: `{"status": "running", "models_loaded": true}`

2. **Test Frontend**:
   - Visit your frontend URL
   - Try submitting an email for spam detection
   - Check browser console for any errors

---

## Troubleshooting

### Backend Issues

**Problem: Models not loading**
- **Solution**: Check if `spam mail.csv` exists in the repository
- Go to Render Shell: `cd /opt/render/project/src/src/backend` and verify files
- Manually train: `python train_model.py`

**Problem: Build fails**
- **Solution**: Check build logs in Render dashboard
- Verify `requirements.txt` has all dependencies
- Ensure Python version is 3.11+

**Problem: Port errors**
- **Solution**: Render sets PORT automatically, ensure `gunicorn_config.py` uses `os.environ.get('PORT', '5000')`

**Problem: CORS errors**
- **Solution**: Verify `flask-cors` is installed and CORS is enabled in `app.py`

### Frontend Issues

**Problem: Can't connect to backend**
- **Solution**: 
  - Verify `VITE_API_URL` is set correctly in Render environment variables
  - Rebuild frontend after setting environment variable
  - Check backend URL is accessible (visit `/api/health`)

**Problem: Build fails**
- **Solution**: 
  - Check Node.js version (requires 18+)
  - Verify all dependencies in `package.json`
  - Check build logs for specific errors

**Problem: Environment variables not working**
- **Solution**: 
  - Vite requires `VITE_` prefix for environment variables
  - Rebuild after changing environment variables
  - Clear browser cache

---

## Using render.yaml (Alternative Method)

If you prefer using the `render.yaml` file:

1. **Ensure `render.yaml` is in your repository root**

2. **In Render Dashboard**:
   - Click "New +" → "Blueprint"
   - Connect your repository
   - Render will detect `render.yaml` and create services automatically

3. **Set Environment Variables**:
   - Go to each service → Environment
   - Set `VITE_API_URL` for frontend (use your backend URL)

---

## Important Notes

1. **Free Tier Limitations**:
   - Services spin down after 15 minutes of inactivity
   - First request after spin-down may take 30-60 seconds
   - Consider upgrading for production use

2. **Dataset Location**:
   - Ensure `spam mail.csv` is committed to your repository
   - Or upload via Render Shell after deployment

3. **Environment Variables**:
   - Backend URL changes on each deployment (unless using custom domain)
   - Update `VITE_API_URL` in frontend if backend URL changes

4. **Custom Domains**:
   - Both services support custom domains
   - Configure in Render dashboard → Settings → Custom Domain

---

## Quick Reference

**Backend Configuration:**
- Root Directory: `FullWebsitewithSpamDetection/src/backend`
- Build: `pip install -r requirements.txt && python train_model.py`
- Start: `gunicorn app:app --config gunicorn_config.py`

**Frontend Configuration:**
- Root Directory: `FullWebsitewithSpamDetection`
- Build: `npm install && npm run build`
- Publish: `build`
- Env Var: `VITE_API_URL=https://your-backend.onrender.com`

---

## Support

If you encounter issues:
1. Check Render build logs
2. Check Render runtime logs
3. Verify all files are in correct locations
4. Test backend health endpoint directly
5. Check browser console for frontend errors

For Render-specific issues, visit: https://render.com/docs

