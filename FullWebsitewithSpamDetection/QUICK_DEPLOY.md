# Quick Deployment Guide

## 🚀 Fastest Way to Deploy

### Option 1: Docker (Recommended)

**Prerequisites:** Docker and Docker Compose installed

```bash
# Navigate to project directory
cd FullWebsitewithSpamDetection

# Deploy everything
docker-compose up --build

# Or run in background
docker-compose up --build -d
```

**Access:**
- Frontend: http://localhost
- Backend API: http://localhost:5000
- Health Check: http://localhost:5000/api/health

**Stop:**
```bash
docker-compose down
```

---

### Option 2: Using Deployment Scripts

**Windows:**
```bash
deploy.bat docker
```

**Linux/Mac:**
```bash
chmod +x deploy.sh
./deploy.sh docker
```

---

### Option 3: Manual Setup

**Backend:**
```bash
cd src/backend
pip install -r requirements.txt
python train_model.py
python app.py
```

**Frontend (new terminal):**
```bash
cd FullWebsitewithSpamDetection
npm install
npm run dev
```

---

## 📋 Pre-Deployment Checklist

- [ ] Docker installed (for Docker deployment)
- [ ] Node.js 18+ installed (for manual deployment)
- [ ] Python 3.11+ installed (for manual deployment)
- [ ] `spam mail.csv` file exists in `FullWebsitewithSpamDetection/` directory

---

## 🌐 Cloud Deployment

See [DEPLOYMENT.md](./DEPLOYMENT.md) for detailed cloud platform instructions:
- Vercel + Railway
- Netlify + Heroku
- Other platforms

---

## 🐛 Troubleshooting

**Backend won't start:**
- Check if port 5000 is available
- Ensure `spam mail.csv` exists
- Run `python train_model.py` manually

**Frontend can't connect to backend:**
- Verify backend is running on port 5000
- Check `VITE_API_URL` environment variable
- Ensure CORS is enabled in backend

**Docker issues:**
- Check Docker daemon is running
- View logs: `docker-compose logs`
- Rebuild: `docker-compose up --build`

---

For detailed deployment instructions, see [DEPLOYMENT.md](./DEPLOYMENT.md)

