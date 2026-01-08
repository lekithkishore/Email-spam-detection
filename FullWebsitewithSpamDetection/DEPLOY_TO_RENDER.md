# 🚀 Deploy to Render - Complete Guide

Your project is now ready to deploy to Render! Follow the steps below.

## 📋 Pre-Deployment Checklist

Before starting, ensure:
- ✅ Your code is pushed to GitHub
- ✅ `spam mail.csv` is in your repository (at `FullWebsitewithSpamDetection/spam mail.csv`)
- ✅ You have a Render account (sign up at https://render.com)

---

## 🎯 Quick Deployment (Recommended)

**Follow the step-by-step guide:** [RENDER_QUICK_START.md](./RENDER_QUICK_START.md)

This guide will walk you through deploying both backend and frontend in under 10 minutes.

---

## 📚 Detailed Documentation

- **[RENDER_QUICK_START.md](./RENDER_QUICK_START.md)** - Step-by-step quick start guide
- **[RENDER_DEPLOYMENT.md](./RENDER_DEPLOYMENT.md)** - Comprehensive deployment guide with troubleshooting

---

## 🔑 Key Configuration Summary

### Backend Configuration
- **Root Directory**: `FullWebsitewithSpamDetection/src/backend`
- **Build Command**: `chmod +x render_build.sh && ./render_build.sh`
- **Start Command**: `gunicorn app:app --config gunicorn_config.py`
- **Environment Variables**:
  - `FLASK_ENV=production`
  - `FLASK_DEBUG=False`
  - `PYTHONUNBUFFERED=1`

### Frontend Configuration
- **Root Directory**: `FullWebsitewithSpamDetection`
- **Build Command**: `npm install && npm run build`
- **Publish Directory**: `build`
- **Environment Variables**:
  - `VITE_API_URL=https://your-backend-url.onrender.com`

---

## 🚀 Start Deployment Now

1. **Open**: [RENDER_QUICK_START.md](./RENDER_QUICK_START.md)
2. **Follow**: Step-by-step instructions
3. **Deploy**: Your app will be live in minutes!

---

## 💡 Pro Tips

1. **Deploy backend first** - You'll need the backend URL for frontend configuration
2. **Copy backend URL** - Save it when backend deployment completes
3. **Set VITE_API_URL** - Must be set before frontend build
4. **Check logs** - Monitor build and runtime logs in Render dashboard

---

## 🆘 Need Help?

- Check [RENDER_DEPLOYMENT.md](./RENDER_DEPLOYMENT.md) for troubleshooting
- Review Render build logs in dashboard
- Verify all files are in correct locations
- Test backend health endpoint: `/api/health`

Good luck with your deployment! 🎉

