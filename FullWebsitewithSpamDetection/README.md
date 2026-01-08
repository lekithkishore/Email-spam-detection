
  # Full Website with Spam Detection

  This is a code bundle for Full Website with Spam Detection. The original project is available at https://www.figma.com/design/2WhL1E32VFZtmw0XiuRviM/Full-Website-with-Spam-Detection.

  ## 🚀 Quick Start

  ### Development
  ```bash
  # Install dependencies
  npm install
  
  # Start frontend dev server
  npm run dev
  
  # In another terminal, start backend
  cd src/backend
  pip install -r requirements.txt
  python train_model.py  # Train models first
  python app.py
  ```

  ### Production Deployment

  **Docker (Recommended):**
  ```bash
  docker-compose up --build
  ```

  **Quick Deploy Script:**
  - Windows: `deploy.bat docker`
  - Linux/Mac: `./deploy.sh docker`

  For detailed deployment instructions, see:
  - [QUICK_DEPLOY.md](./QUICK_DEPLOY.md) - Quick start guide
  - [DEPLOYMENT.md](./DEPLOYMENT.md) - Comprehensive deployment guide

  ## 📁 Project Structure

  ```
  FullWebsitewithSpamDetection/
  ├── src/
  │   ├── backend/          # Flask API with ML models
  │   ├── components/        # React components
  │   └── utils/            # Utility functions
  ├── docker-compose.yml    # Docker deployment config
  ├── Dockerfile           # Frontend Dockerfile
  └── package.json         # Frontend dependencies
  ```

  ## 🛠️ Tech Stack

  - **Frontend:** React + TypeScript + Vite
  - **Backend:** Flask (Python)
  - **ML Models:** scikit-learn (Naive Bayes, SVM, Random Forest, Logistic Regression)
  - **Deployment:** Docker, Docker Compose

  ## 📚 Documentation

  - [Setup Guide](./src/SETUP_GUIDE.md)
  - [Backend README](./src/backend/README.md)
  - [Deployment Guide](./DEPLOYMENT.md)
  - [Quick Deploy](./QUICK_DEPLOY.md)
  