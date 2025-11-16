# RAAH-SETU: Quick Installation Links

## Download Links

### Python 3.11
- **Microsoft Store (Easiest)**: Search for "Python 3.11" in Microsoft Store and click Install
- **Official Site**: https://www.python.org/downloads/release/python-3117/
- **Direct Download**: https://www.python.org/ftp/python/3.11.7/python-3.11.7-amd64.exe

### Node.js (Includes npm)
- **Official Site**: https://nodejs.org/ (Download LTS version)
- **Direct Download**: https://nodejs.org/dist/v20.10.0/node-v20.10.0-x64.msi

### MySQL Server (Optional but Recommended)
- **Official Site**: https://dev.mysql.com/downloads/mysql/
- **Community Server**: https://dev.mysql.com/downloads/mysql/

---

## Installation Steps (Quick)

### 1️⃣ Install Python
```
Option A (Easiest):
  1. Press Windows + S
  2. Search "Python 3.11"
  3. Click "Get" in Microsoft Store
  
Option B (Direct):
  1. Go to: https://www.python.org/downloads/
  2. Download Python 3.11
  3. Run installer
  4. ⚠️ CHECK "Add Python to PATH"
  5. Click Install
```

### 2️⃣ Install Node.js
```
  1. Go to: https://nodejs.org/
  2. Download LTS version
  3. Run the installer
  4. Follow the wizard (defaults are fine)
```

### 3️⃣ Restart Terminal
```
  Close and reopen PowerShell/Command Prompt
  This refreshes the PATH
```

### 4️⃣ Verify Installation
```powershell
python --version
# Should show: Python 3.11.x

node --version
# Should show: v20.10.0 or higher

npm --version
# Should show: 10.x.x or higher
```

### 5️⃣ Run the Project
```powershell
cd c:\Users\dell\Downloads\Hackthone-main\ (3)\Hackthone-main

# Run this script to install dependencies and start everything:
.\INSTALL_AND_RUN.bat
```

---

## What This Will Do

The `INSTALL_AND_RUN.bat` script will:

1. ✅ Check if Python, Node.js, and npm are installed
2. ✅ Install Python dependencies (Flask, MySQL, bcrypt, etc.)
3. ✅ Install npm dependencies (React, TypeScript, etc.)
4. ✅ Create database schema
5. ✅ Start Backend server on port 5000
6. ✅ Start Frontend dev server on port 8080
7. ✅ Open browser to http://localhost:8080

---

## Expected Result

After running, you should see:
- ✅ Backend terminal showing: `Running on http://127.0.0.1:5000`
- ✅ Frontend terminal showing: `Local: http://localhost:8080`
- ✅ Browser window opening with RAAH-SETU login page

---

## Test the Application

1. **Sign Up**: Create a new account
2. **Login**: Log in with your credentials
3. **Add Emergency Contacts**: Add a contact
4. **Check Dashboard**: View analytics and health status
5. **View All Features**: Explore all 17 pages

---

## Troubleshooting

| Issue | Solution |
|-------|----------|
| Python not found | Install from https://www.python.org/ (check "Add to PATH") |
| npm not found | Install Node.js from https://nodejs.org/ |
| Port 5000 in use | Kill process: `netstat -ano \| findstr :5000` |
| Port 8080 in use | Kill process: `netstat -ano \| findstr :8080` |
| Database connection failed | Install MySQL or ensure it's running |

---

## Documentation Files

- **MANUAL_INSTALLATION_GUIDE.md** - Complete step-by-step guide (with all details)
- **INSTALL_AND_RUN.bat** - Automated installation script
- **RUN_PROJECT.md** - How to run the project
- **PROJECT_README.md** - Project overview
- **EXECUTION_CHECKLIST.md** - Testing checklist

---

## Key Directories

```
Hackthone-main/
├── Backend/              ← Flask backend (Python)
│   ├── api_enhanced.py   ← Main server
│   ├── create_schema.py  ← Database setup
│   └── requirements.txt  ← Python dependencies
├── client/               ← React frontend (TypeScript)
│   ├── pages/            ← 17 application pages
│   ├── components/       ← React components
│   └── lib/api.ts        ← API integration
├── package.json          ← npm configuration
└── [Various guides]      ← Documentation

```

---

## Support

**If you have issues:**
1. Check the error message in the terminal
2. Visit the troubleshooting section above
3. Ensure all downloads completed successfully
4. Try restarting after installation
5. Make sure ports 5000 and 8080 are available

---

**Ready? Follow the 5 steps above! 🚀**

Your safety application awaits!
