# Deployment Guide

This guide covers multiple deployment options for the Email Spam Detection application.

## Table of Contents
- [Docker Deployment](#docker-deployment)
- [Cloud Platform Deployment](#cloud-platform-deployment)
- [Manual Deployment](#manual-deployment)

---

## Docker Deployment

### Prerequisites
- Docker and Docker Compose installed
- `spam mail.csv` dataset file in the project root

### Quick Start

1. **Navigate to the project directory:**
   ```bash
   cd FullWebsitewithSpamDetection
   ```

2. **Copy environment files:**
   ```bash
   cp .env.example .env
   cp src/backend/.env.example src/backend/.env
   ```

3. **Update `.env` files with your configuration:**
   - Frontend `.env`: Set `VITE_API_URL` to your backend URL
   - Backend `.env`: Configure Flask settings

4. **Ensure dataset is available:**
   - Copy `spam mail.csv` to the project root (if not already there)

5. **Build and start containers:**
   ```bash
   docker-compose up --build
   ```

6. **Access the application:**
   - Frontend: http://localhost
   - Backend API: http://localhost:5000
   - Health Check: http://localhost:5000/api/health

### Docker Commands

```bash
# Start services
docker-compose up -d

# View logs
docker-compose logs -f

# Stop services
docker-compose down

# Rebuild after changes
docker-compose up --build

# View running containers
docker-compose ps
```

---

## Cloud Platform Deployment

### Option 1: Vercel (Frontend) + Railway/Render (Backend)

#### Frontend on Vercel

1. **Install Vercel CLI:**
   ```bash
   npm i -g vercel
   ```

2. **Login to Vercel:**
   ```bash
   vercel login
   ```

3. **Deploy:**
   ```bash
   cd FullWebsitewithSpamDetection
   vercel
   ```

4. **Set Environment Variables in Vercel Dashboard:**
   - `VITE_API_URL`: Your backend API URL

5. **Redeploy after setting environment variables:**
   ```bash
   vercel --prod
   ```

#### Backend on Railway

1. **Create Railway account** at https://railway.app

2. **Create new project** and select "Deploy from GitHub"

3. **Connect your repository** and select the backend directory (`src/backend`)

4. **Configure build settings:**
   - Root Directory: `src/backend`
   - Build Command: (leave empty, Dockerfile handles it)
   - Start Command: `python app.py`

5. **Set Environment Variables:**
   - `FLASK_ENV=production`
   - `PORT=5000` (Railway sets this automatically)

6. **Add dataset:**
   - Upload `spam mail.csv` via Railway's file system or use environment variables

7. **Deploy** - Railway will automatically build and deploy

#### Backend on Render

1. **Create Render account** at https://render.com

2. **Create new Web Service**

3. **Connect repository** and configure:
   - Name: `spam-detection-backend`
   - Root Directory: `src/backend`
   - Environment: `Python 3`
   - Build Command: `pip install -r requirements.txt && python train_model.py`
   - Start Command: `gunicorn app:app --bind 0.0.0.0:$PORT`
   - Port: `5000`

4. **Set Environment Variables:**
   - `FLASK_ENV=production`
   - `PORT=5000`

5. **Add dataset:**
   - Upload `spam mail.csv` to the service

6. **Deploy**

### Option 2: Netlify (Frontend) + Heroku (Backend)

#### Frontend on Netlify

1. **Install Netlify CLI:**
   ```bash
   npm install -g netlify-cli
   ```

2. **Build the project:**
   ```bash
   cd FullWebsitewithSpamDetection
   npm install
   npm run build
   ```

3. **Deploy:**
   ```bash
   netlify deploy --prod --dir=build
   ```

4. **Set Environment Variables in Netlify Dashboard:**
   - `VITE_API_URL`: Your backend API URL

#### Backend on Heroku

1. **Install Heroku CLI** and login

2. **Create Heroku app:**
   ```bash
   cd src/backend
   heroku create your-app-name
   ```

3. **Add buildpacks:**
   ```bash
   heroku buildpacks:add heroku/python
   ```

4. **Set environment variables:**
   ```bash
   heroku config:set FLASK_ENV=production
   ```

5. **Deploy:**
   ```bash
   git push heroku main
   ```

---

## Manual Deployment

### Backend Setup

1. **Install Python dependencies:**
   ```bash
   cd src/backend
   pip install -r requirements.txt
   ```

2. **Train models:**
   ```bash
   python train_model.py
   ```

3. **Run with Gunicorn (production):**
   ```bash
   pip install gunicorn
   gunicorn -w 4 -b 0.0.0.0:5000 app:app
   ```

### Frontend Setup

1. **Install dependencies:**
   ```bash
   cd FullWebsitewithSpamDetection
   npm install
   ```

2. **Set environment variables:**
   ```bash
   cp .env.example .env
   # Edit .env with your API URL
   ```

3. **Build:**
   ```bash
   npm run build
   ```

4. **Serve with a web server:**
   ```bash
   # Using Python's http.server
   cd build
   python -m http.server 8000
   
   # Or using nginx (recommended for production)
   # Copy build files to nginx html directory
   ```

---

## Environment Variables Reference

### Frontend (.env)
- `VITE_API_URL`: Backend API URL (default: `http://localhost:5000`)

### Backend (.env)
- `FLASK_ENV`: Flask environment (`production` or `development`)
- `FLASK_DEBUG`: Enable debug mode (`True` or `False`)
- `HOST`: Server host (default: `0.0.0.0`)
- `PORT`: Server port (default: `5000`)

---

## Troubleshooting

### Backend Issues

1. **Models not loading:**
   - Ensure `spam mail.csv` exists and models are trained
   - Run `python train_model.py` manually
   - Check `models/` directory exists with `.pkl` files

2. **CORS errors:**
   - Verify `flask-cors` is installed
   - Check CORS configuration in `app.py`

3. **Port already in use:**
   - Change port in `.env` or docker-compose.yml
   - Kill process using the port: `lsof -ti:5000 | xargs kill`

### Frontend Issues

1. **API connection errors:**
   - Verify `VITE_API_URL` is set correctly
   - Check backend is running and accessible
   - Verify CORS is enabled on backend

2. **Build errors:**
   - Clear node_modules and reinstall: `rm -rf node_modules && npm install`
   - Check Node.js version (requires Node 18+)

### Docker Issues

1. **Build fails:**
   - Check Docker daemon is running
   - Verify all files are in correct locations
   - Check Docker logs: `docker-compose logs`

2. **Container won't start:**
   - Check logs: `docker-compose logs backend` or `docker-compose logs frontend`
   - Verify environment variables are set
   - Check port conflicts

---

## Production Checklist

- [ ] Set `FLASK_ENV=production` in backend
- [ ] Set `FLASK_DEBUG=False` in backend
- [ ] Configure proper CORS origins
- [ ] Set up HTTPS/SSL certificates
- [ ] Configure proper logging
- [ ] Set up monitoring and error tracking
- [ ] Configure backup for models
- [ ] Set up CI/CD pipeline
- [ ] Configure rate limiting (if needed)
- [ ] Set up database for persistent storage (if needed)

---

## Support

For issues or questions, please check:
- Backend README: `src/backend/README.md`
- Project README: `README.md`
- Setup Guide: `src/SETUP_GUIDE.md`

