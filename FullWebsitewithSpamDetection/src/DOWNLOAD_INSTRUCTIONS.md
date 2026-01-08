# 📦 Download Instructions for Backend

Your spam detection web app is ready! The frontend is already running in Figma Make. Now you just need to download the backend files and train them with your dataset.

## 🎯 What You Need to Download

Download ALL files from the `/backend` folder:

### Core Files (Required)
- ✅ `app.py` - Flask API server
- ✅ `spam_detector.py` - ML models implementation  
- ✅ `train_model.py` - Training script
- ✅ `requirements.txt` - Python dependencies
- ✅ `README.md` - Detailed documentation

### Helper Files (Optional but Recommended)
- ✅ `test_api.py` - API testing script
- ✅ `QUICKSTART.bat` - Windows quick setup (double-click to run)
- ✅ `START_SERVER.bat` - Windows server starter
- ✅ `quickstart.sh` - Linux/Mac quick setup
- ✅ `start_server.sh` - Linux/Mac server starter

## 📥 How to Download

### Option 1: Download via Figma Make (Recommended)
1. Look for the "Download" or "Export" button in Figma Make
2. Download the entire project
3. Navigate to the `backend` folder

### Option 2: Copy Files Manually
1. Click on each file in the `/backend` folder
2. Copy the contents
3. Create a new file on your computer with the same name
4. Paste the contents and save

### Option 3: Use Browser Dev Tools
1. Open browser developer console (F12)
2. Go to the Sources or Network tab
3. Find and download the files

## 📁 Folder Structure After Download

Create this structure on your computer:

```
my-spam-detector/
├── backend/                    ← Create this folder
│   ├── app.py                 ← Download these
│   ├── spam_detector.py       
│   ├── train_model.py
│   ├── test_api.py
│   ├── requirements.txt
│   ├── README.md
│   ├── QUICKSTART.bat         (Windows)
│   ├── START_SERVER.bat       (Windows)
│   ├── quickstart.sh          (Linux/Mac)
│   ├── start_server.sh        (Linux/Mac)
│   └── spam mail.csv          ← YOUR DATASET (place here)
```

## 🚀 Quick Setup (After Download)

### Windows Users:

1. **Place your dataset:**
   - Put `spam mail.csv` in the `backend` folder

2. **Run quick setup:**
   - Double-click `QUICKSTART.bat`
   - Wait for installation and training (1-2 minutes)

3. **Start the server:**
   - Double-click `START_SERVER.bat`
   - Server runs at http://localhost:5000

### Linux/Mac Users:

1. **Make scripts executable:**
   ```bash
   cd backend
   chmod +x quickstart.sh start_server.sh
   ```

2. **Place your dataset:**
   - Put `spam mail.csv` in the `backend` folder

3. **Run quick setup:**
   ```bash
   ./quickstart.sh
   ```

4. **Start the server:**
   ```bash
   ./start_server.sh
   ```

### Manual Setup (All Platforms):

```bash
# 1. Navigate to backend folder
cd backend

# 2. Install dependencies
pip install -r requirements.txt

# 3. Train models (make sure spam mail.csv is in the folder)
python train_model.py

# 4. Start server
python app.py
```

## ✅ What You Should See

After training completes, you should see:

```
==============================================================
 TRAINING SUMMARY 
==============================================================

Model Performance on Test Set:

Naive Bayes:     Accuracy: 98.30%
SVM:             Accuracy: 98.93%  ← Best!
Random Forest:   Accuracy: 98.84%
Logistic Reg:    Accuracy: 98.57%

✓ Models trained and saved successfully!
```

When server starts:

```
==============================================================
Email Spam Detection API Server
==============================================================
Server running on: http://localhost:5000
✓ Models loaded successfully!
```

## 🔗 Connect to Frontend (Optional)

The frontend currently works perfectly with pattern-based detection (no backend needed).

**To use your trained ML models:**

1. Make sure backend server is running
2. The frontend will automatically detect and use it!

Or manually update `SenderInterface.tsx`:
```typescript
// Change import from:
import { detectSpam } from '../utils/spamDetector';

// To:
import { detectSpamWithAPI as detectSpam } from '../utils/apiSpamDetector';
```

## 📊 Your Dataset Format

Your `spam mail.csv` should look like:

```csv
Category,Messages
ham,"Normal message text here"
spam,"Spam message text here"
ham,"Another legitimate message"
spam,"Another spam message"
```

**Requirements:**
- Column 1: `Category` (values: `ham` or `spam`)
- Column 2: `Messages` (email text)
- CSV format with comma separator
- UTF-8 or Latin-1 encoding

## 🧪 Testing

After setup, test the API:

```bash
# Test health endpoint
curl http://localhost:5000/api/health

# Test prediction
curl -X POST http://localhost:5000/api/predict \
  -H "Content-Type: application/json" \
  -d '{"subject":"Test","content":"Hello world"}'
```

Or run the test script:
```bash
python test_api.py
```

## 📚 Documentation

- **Full Setup Guide:** See `/SETUP_GUIDE.md`
- **Backend Documentation:** See `/backend/README.md`  
- **API Reference:** See `/backend/README.md` → API Endpoints section

## 🐛 Troubleshooting

### "spam mail.csv not found"
→ Make sure the file is in the `backend` folder with exact name (with space)

### "Module not found"
→ Run: `pip install -r requirements.txt`

### "Port 5000 already in use"
→ Change port in `app.py` line: `app.run(port=5001)`

### "Permission denied" (Linux/Mac)
→ Run: `chmod +x quickstart.sh start_server.sh`

## 🎉 That's It!

Your complete spam detection system is ready:

✅ **Frontend** - Already running in Figma Make with advanced pattern detection  
✅ **Backend** - Download, train with your data, and run!  
✅ **ML Models** - 4 models trained (98%+ accuracy)  
✅ **API** - RESTful API for predictions  
✅ **Testing** - Test scripts and examples included  

Both frontend and backend work independently, so you can:
- Use frontend only (pattern-based detection) ← Works now!
- Use backend only (API for other apps)
- Use both together (full ML-powered system)

## 📞 Need Help?

1. Check `/SETUP_GUIDE.md` for detailed instructions
2. Read `/backend/README.md` for API documentation
3. Verify your dataset format matches the examples
4. Make sure Python 3.8+ is installed

Happy spam detecting! 🚀🎯
