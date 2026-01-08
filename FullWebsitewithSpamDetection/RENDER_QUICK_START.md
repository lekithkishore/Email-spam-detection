# 🚀 Quick Start: Deploy to Render

Follow these steps to deploy your Email Spam Detection app to Render in under 10 minutes!

## Prerequisites Checklist

- [ ] Render account (sign up at https://render.com)
- [ ] GitHub account
- [ ] Code pushed to GitHub repository
- [ ] `spam mail.csv` file in your repository

---

## Step-by-Step Deployment

### Part 1: Deploy Backend (5 minutes)

1. **Go to Render Dashboard**
   - Visit: https://dashboard.render.com
   - Sign in or create account

2. **Create New Web Service**
   - Click **"New +"** button (top right)
   - Select **"Web Service"**

3. **Connect GitHub**
   - Click **"Connect account"** if first time
   - Authorize Render to access your repositories
   - Select your repository
   - Click **"Connect"**

4. **Configure Backend**
   ```
   Name: spam-detection-backend
   Region: Oregon (or closest to you)
   Branch: main
   Root Directory: FullWebsitewithSpamDetection/src/backend
   Environment: Python 3
   Build Command: chmod +x render_build.sh && ./render_build.sh
   Start Command: gunicorn app:app --config gunicorn_config.py
   Plan: Free
   ```

5. **Add Environment Variables**
   - Click **"Advanced"** → **"Add Environment Variable"**
   - Add these:
     ```
     FLASK_ENV = production
     FLASK_DEBUG = False
     PYTHONUNBUFFERED = 1
     ```

6. **Deploy**
   - Click **"Create Web Service"**
   - Wait 5-10 minutes for first build
   - **Copy your backend URL** (e.g., `https://spam-detection-backend.onrender.com`)

---

### Part 2: Deploy Frontend (3 minutes)

1. **Create Static Site**
   - In Render Dashboard, click **"New +"**
   - Select **"Static Site"**

2. **Connect Same Repository**
   - Select your repository again
   - Click **"Connect"**

3. **Configure Frontend**
   ```
   Name: spam-detection-frontend
   Region: Same as backend
   Branch: main
   Root Directory: FullWebsitewithSpamDetection
   Build Command: npm install && npm run build
   Publish Directory: build
   Plan: Free
   ```

4. **Set Environment Variable**
   - Click **"Environment"** tab
   - Click **"Add Environment Variable"**
   - Add:
     ```
     Key: VITE_API_URL
     Value: https://your-backend-url.onrender.com
     ```
     (Use the backend URL you copied in Part 1, Step 6)

5. **Deploy**
   - Click **"Create Static Site"**
   - Wait 2-5 minutes for build
   - Your app is live! 🎉

---

## ✅ Verify Deployment

1. **Test Backend**
   - Visit: `https://your-backend-url.onrender.com/api/health`
   - Should see: `{"status": "running", "models_loaded": true}`

2. **Test Frontend**
   - Visit your frontend URL
   - Try detecting spam on an email
   - Check browser console (F12) for any errors

---

## 🔧 Troubleshooting

**Backend not working?**
- Check build logs in Render dashboard
- Verify `spam mail.csv` exists in repository
- Check environment variables are set correctly

**Frontend can't connect?**
- Verify `VITE_API_URL` is set correctly
- Rebuild frontend after setting environment variable
- Check backend URL is accessible

**Models not loading?**
- Ensure `spam mail.csv` is in `FullWebsitewithSpamDetection/` directory
- Check build logs for training errors
- Models train during build process

---

## 📝 Important Notes

1. **Free Tier**: Services spin down after 15 min inactivity (first request may be slow)

2. **Environment Variables**: Must rebuild frontend after changing `VITE_API_URL`

3. **Dataset**: Must be in repository or uploaded via Render Shell

4. **Custom Domains**: Available in Settings → Custom Domain

---

## 🎯 Next Steps

- Set up custom domains
- Configure auto-deploy on git push
- Monitor logs and performance
- Upgrade plan for production use

---

## 📚 Need More Help?

- Full guide: [RENDER_DEPLOYMENT.md](./RENDER_DEPLOYMENT.md)
- Render docs: https://render.com/docs
- Check build/runtime logs in Render dashboard

