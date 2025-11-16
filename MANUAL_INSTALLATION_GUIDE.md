# RAAH-SETU: Complete Manual Installation & Running Guide

## ⚠️ System Requirements Not Met

Your system is missing Python 3.8+ and Node.js. These are required to run the project.

---

## Step 1: Install Python 3.11

**Option A: Microsoft Store (Recommended)**
```
1. Press Windows + S
2. Search for "Python 3.11"
3. Click the official Python 3.11 app
4. Click "Get" or "Install"
5. Wait for installation to complete
6. Python will be added to PATH automatically
```

**Option B: Direct Download**
```
1. Visit: https://www.python.org/downloads/release/python-3117/
2. Download: Windows installer (64-bit) - python-3.11.7-amd64.exe
3. Run the installer
4. ⚠️ IMPORTANT: Check "Add Python 3.11 to PATH" before clicking Install
5. Click "Install Now"
6. Wait for completion
```

**Verify Installation:**
```powershell
python --version
# Should show: Python 3.11.x
```

---

## Step 2: Install Node.js (Includes npm)

**Direct Download (Recommended)**
```
1. Visit: https://nodejs.org/
2. Download: LTS version (v20.10.0 or latest)
3. Run the .msi installer
4. Follow the wizard (default settings are fine)
5. npm is included with Node.js
6. Restart your computer after installation
```

**Verify Installation:**
```powershell
node --version
# Should show: v20.10.0 or similar

npm --version
# Should show: 10.2.3 or similar
```

---

## Step 3: Install MySQL Server

**Download & Install:**
```
1. Visit: https://dev.mysql.com/downloads/mysql/
2. Download: MySQL Community Server (latest stable)
3. Run the installer
4. Choose: Developer Default or Server only
5. Next through the configuration:
   - TCP/IP: Port 3306
   - MySQL User: root
   - Password: (set a password or leave empty)
6. Execute Configuration
```

**Verify MySQL is Running:**
```powershell
# Check if MySQL service is running
Get-Service -Name MySQL80 | Select-Object Status

# Try to connect (if password is set, add -p)
mysql -h localhost -u root -e "SELECT 1"
```

---

## Step 4: Install Backend Dependencies

Once Python is installed, open PowerShell/Command Prompt and run:

```powershell
cd "c:\Users\dell\Downloads\Hackthone-main (3)\Hackthone-main\Backend"

# Upgrade pip
python -m pip install --upgrade pip

# Install required packages
python -m pip install -r requirements.txt

# Packages that will be installed:
# - flask
# - flask-cors
# - mysql-connector-python
# - bcrypt
# - python-dotenv
```

**Expected Output:**
```
Successfully installed flask-2.3.x flask-cors-4.0.x mysql-connector-python-8.0.x...
```

---

## Step 5: Install Frontend Dependencies

Once Node.js is installed, run:

```powershell
cd "c:\Users\dell\Downloads\Hackthone-main (3)\Hackthone-main"

# Install npm packages
npm install

# This will create node_modules/ folder with all dependencies
# Takes 2-5 minutes depending on internet speed
```

**Expected Output:**
```
added 250+ packages in 2m30s
```

---

## Step 6: Setup Database

```powershell
cd "c:\Users\dell\Downloads\Hackthone-main (3)\Hackthone-main\Backend"

# Create database and tables
python create_schema.py
```

**Expected Output:**
```
Database 'raah_setu' created successfully
All tables created successfully
```

---

## Step 7: Run the Complete Project

### Option A: Automated (Recommended)

Once all dependencies are installed, run:

```powershell
cd "c:\Users\dell\Downloads\Hackthone-main (3)\Hackthone-main"

# Run the batch script (Windows)
.\INSTALL_AND_RUN.bat

# This will:
# 1. Verify all dependencies
# 2. Start Backend server
# 3. Start Frontend dev server
# 4. Open browser to http://localhost:8080
```

---

### Option B: Manual - Start Each Service Separately

**Terminal 1: Start Backend**
```powershell
cd "c:\Users\dell\Downloads\Hackthone-main (3)\Hackthone-main\Backend"
python api_enhanced.py

# Expected output:
# * Running on http://127.0.0.1:5000
```

**Terminal 2: Start Frontend**
```powershell
cd "c:\Users\dell\Downloads\Hackthone-main (3)\Hackthone-main"
npm run dev

# Expected output:
# Local:   http://localhost:8080
```

**Terminal 3 (Optional): View Logs**
```powershell
# You can keep this terminal open to monitor services
# Or just check the other terminal windows
```

**Step 3: Open Application**
```
1. Open your web browser
2. Go to: http://localhost:8080
3. You should see the RAAH-SETU login page
```

---

## Step 8: Test the Application

### Create an Account
```
1. Click "Sign Up"
2. Fill in details:
   - Name: Test User
   - Email: test@example.com
   - Phone: +1234567890
   - Password: TestPassword123
   - Confirm Password: TestPassword123
3. Click "Create Account"
4. You should see a success message
```

### Login
```
1. Click "Login"
2. Enter email and password from signup
3. Click "Login"
4. You should be logged in and see the Dashboard
```

### Add Emergency Contacts
```
1. Click "Emergency Contacts" in sidebar
2. Click "Add Emergency Contact"
3. Fill in contact details:
   - Name: Mom
   - Relationship: Mother
   - Phone: +1234567890
4. Click "Save Contact"
5. Contact should appear in the list
```

### Other Features to Test
```
- Health Checks: Log a health check
- Incident Reports: Report an incident
- Analytics: View dashboard analytics
- Notifications: Check notification settings
- Safety Tips: View safety recommendations
```

---

## Troubleshooting

### Python Not Found
```
Issue: "Python was not found"
Solution:
1. Install Python from Microsoft Store or python.org
2. Make sure to check "Add to PATH" during installation
3. Restart PowerShell/Command Prompt
4. Type: python --version
```

### npm Not Found
```
Issue: "npm: The term 'npm' is not recognized"
Solution:
1. Install Node.js from nodejs.org
2. Restart PowerShell/Command Prompt
3. Type: npm --version
```

### Port Already in Use
```
Issue: "Address already in use" for port 5000 or 8080
Solution:
1. Find process using port:
   Get-NetTCPConnection -LocalPort 5000 | Select-Object OwnerProcess
   
2. Kill the process:
   Stop-Process -Id <PID> -Force
   
3. Try again
```

### Database Connection Failed
```
Issue: "Can't connect to MySQL server"
Solution:
1. Check if MySQL is running:
   Get-Service -Name MySQL80 | Start-Service
   
2. Verify MySQL connection:
   mysql -h localhost -u root -e "SELECT 1"
   
3. If password is needed:
   mysql -h localhost -u root -p -e "SELECT 1"
```

### Module Not Found
```
Issue: "ModuleNotFoundError: No module named 'flask'"
Solution:
1. Make sure you're in Backend directory:
   cd Backend
   
2. Reinstall packages:
   python -m pip install -r requirements.txt
```

### Dependencies Installation Fails
```
Issue: pip install fails
Solution:
1. Upgrade pip:
   python -m pip install --upgrade pip
   
2. Clear cache:
   pip cache purge
   
3. Try install again:
   pip install -r requirements.txt
```

---

## Project URLs

Once running:
- **Frontend**: http://localhost:8080
- **Backend API**: http://127.0.0.1:5000
- **Database**: localhost:3306 (MySQL)

---

## Key Files

```
Hackthone-main/
├── Backend/
│   ├── api_enhanced.py      # Flask backend server
│   ├── create_schema.py     # Database setup script
│   └── requirements.txt     # Python dependencies
├── client/
│   ├── pages/               # React pages
│   ├── components/          # React components
│   └── lib/
│       └── api.ts           # Frontend API client
├── INSTALL_AND_RUN.bat      # Automated setup script
├── package.json             # npm configuration
└── tsconfig.json            # TypeScript configuration
```

---

## Quick Reference Commands

```powershell
# Check versions
python --version
node --version
npm --version
mysql --version

# Install dependencies
cd Backend && pip install -r requirements.txt    # Python
npm install                                       # npm

# Setup database
python Backend/create_schema.py

# Run services
python Backend/api_enhanced.py                   # Backend (Terminal 1)
npm run dev                                       # Frontend (Terminal 2)

# Open application
Start-Process http://localhost:8080
```

---

## Getting Help

If you encounter issues:
1. Check the terminal output for error messages
2. Verify all dependencies are installed
3. Check ports 5000 and 8080 are available
4. Ensure MySQL server is running
5. Try restarting the services

---

**Happy coding! 🚀**

RAAH-SETU is ready to help people stay safe!
