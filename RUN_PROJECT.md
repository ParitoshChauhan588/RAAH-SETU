# 🚀 RAAH-SETU: Complete Project Execution Guide

## ⚠️ Prerequisites Required

Before running the project, you need to install:

1. **Node.js & npm** (for Frontend)
2. **Python 3.8+** (for Backend)
3. **MySQL Server** (for Database)

---

## 📥 Installation Steps

### Step 1: Install Node.js & npm

**Windows:**
1. Visit: https://nodejs.org
2. Download LTS version (v18 or higher)
3. Run installer and follow prompts
4. Verify installation:
```bash
node --version
npm --version
```

### Step 2: Install Python 3.8+

**Windows:**
1. Visit: https://www.python.org/downloads
2. Download Python 3.10 or higher
3. Run installer and **CHECK "Add Python to PATH"**
4. Verify installation:
```bash
python --version
```

### Step 3: Install MySQL Server

**Windows:**
1. Visit: https://dev.mysql.com/downloads/mysql
2. Download MySQL 8.0 Community Server
3. Run installer and follow prompts
4. Default settings: host=localhost, user=root, port=3306
5. Verify installation:
```bash
mysql -u root -p
```

---

## 🎯 Complete Execution Steps

### Terminal 1: Backend Setup & Execution

```bash
# Navigate to Backend folder
cd Backend

# Install Python dependencies
pip install -r requirements.txt

# Create database schema
python create_schema.py

# Run the Flask API server
python api_enhanced.py
```

**Expected Output:**
```
 * Running on http://127.0.0.1:5000 (Press CTRL+C to quit)
 * Debug mode: on
```

✅ Backend is now running on: `http://127.0.0.1:5000/api`

---

### Terminal 2: Frontend Setup & Execution

```bash
# Navigate to project root
cd "c:\Users\dell\Downloads\Hackthone-main (3)\Hackthone-main"

# Install npm dependencies
npm install

# Start development server
npm run dev
```

**Expected Output:**
```
  VITE v4.x.x  ready in XXX ms

  ➜  Local:   http://localhost:8080/
  ➜  press h to show help
```

✅ Frontend is now running on: `http://localhost:8080`

---

### Terminal 3: Test API Health (Optional)

```bash
# Check if backend is running
curl http://127.0.0.1:5000/api/health
```

**Expected Response:**
```json
{
  "status": "ok",
  "message": "RAAH-SETU API is running",
  "version": "2.0"
}
```

---

## 🎨 Access the Application

### In Your Browser:

1. **Open:** `http://localhost:8080`
2. You should see the beautiful RAAH-SETU homepage
3. Click "Sign Up" to create an account
4. Enter details:
   - Name: Your Name
   - Email: your@example.com
   - Phone: 9876543210
   - Password: SecurePass@123

5. After signup, login with your credentials

---

## 🧪 Test Features

### After Login, You Can:

1. **Add Emergency Contacts**
   - Click "Emergency Contacts" in navbar
   - Add contacts with priority levels
   - Delete/Edit contacts
   - Data saves to MySQL database

2. **Log Health Checks**
   - Select mood
   - Enter heart rate
   - Add location
   - Save notes

3. **Report Incidents**
   - Type incident details
   - Set severity level
   - Add location
   - Track status

4. **Use SOS Alert**
   - Click SOS button
   - Activate emergency alert
   - Notifies emergency contacts

5. **View Dashboard**
   - See statistics
   - View activity timeline
   - Analytics

---

## 📊 Project Architecture

```
Frontend (Port 8080)
    ↓ (HTTP/JSON)
    ↓
Backend API (Port 5000)
    ↓ (SQL Queries)
    ↓
MySQL Database
```

---

## 🛠️ Important Files

**Backend:**
- `Backend/api_enhanced.py` - Main API server (18 endpoints)
- `Backend/create_schema.py` - Database setup
- `Backend/requirements.txt` - Python packages

**Frontend:**
- `client/lib/api.ts` - API client for backend communication
- `client/pages/Login.tsx` - Login page
- `client/pages/Signup.tsx` - Signup page
- `client/pages/EmergencyContacts.tsx` - Emergency contacts management

---

## 🔌 API Endpoints Available

```
POST /api/auth/signup              - Create new account
POST /api/auth/login               - Login to account

GET /api/emergency-contacts        - Get all contacts
POST /api/emergency-contacts       - Add contact
PUT /api/emergency-contacts/{id}   - Update contact
DELETE /api/emergency-contacts/{id}- Delete contact

GET /api/health-checks             - Get health history
POST /api/health-checks            - Log health check

GET /api/incidents                 - Get incident reports
POST /api/incidents                - Report incident

GET /api/activities                - Get activity log
POST /api/activities               - Log activity

POST /api/sos/activate             - Activate SOS alert

GET /api/health                    - API health check
```

---

## ✅ Database Setup

When you run `python create_schema.py`, it automatically:

1. ✅ Creates database `raah_setu`
2. ✅ Creates 9 tables:
   - users
   - emergency_contacts
   - health_checks
   - incidents
   - activities
   - sos_alerts
   - alerts
   - notifications
   - guardians

3. ✅ Sets up proper relationships
4. ✅ Adds indexing for performance

---

## 🐛 Troubleshooting

### Issue: "Python was not found"
**Solution:** Install Python from https://python.org and add to PATH

### Issue: "npm: command not found"
**Solution:** Install Node.js from https://nodejs.org

### Issue: "Module not found (flask, mysql-connector)"
**Solution:** Run `pip install -r requirements.txt` in Backend folder

### Issue: "Database connection failed"
**Solution:** 
1. Make sure MySQL is running
2. Verify MySQL credentials (default: root, no password)
3. Check port 3306 is open

### Issue: "Port 5000 already in use"
**Solution:** 
1. Close other applications using port 5000
2. Or change port in `Backend/api_enhanced.py` line:
```python
app.run(debug=True, host='127.0.0.1', port=5001)  # Change 5000 to 5001
```

### Issue: "Port 8080 already in use"
**Solution:** 
1. Close other applications using port 8080
2. Or run: `npm run dev -- --port 3000` (uses port 3000 instead)

---

## 📱 Full User Journey

```
1. Visit http://localhost:8080
   ↓
2. See beautiful landing page
   ↓
3. Click "Sign Up"
   ↓
4. Fill signup form
   ↓
5. Create account (saved to MySQL)
   ↓
6. See login page
   ↓
7. Login with credentials
   ↓
8. See dashboard
   ↓
9. Explore features:
   - Add emergency contacts
   - Log health checks
   - Report incidents
   - Use SOS alert
   - View analytics
   - Manage guardians
```

---

## 📚 Key Features Included

✅ **17 Beautiful Pages**
- Login, Signup, Dashboard
- Emergency Contacts, Health Check
- SOS Alert, Incident Reports
- Analytics, Activity History
- Alerts, Notifications
- Guardians, Profile, Settings
- Safety Tips, Map, 404 Page

✅ **50+ Features**
- User authentication
- Emergency contact management
- Health monitoring
- Incident tracking
- Activity logging
- SOS emergency system
- Guardian system
- Real-time notifications

✅ **Modern UI/UX**
- Gradient backgrounds
- Smooth animations
- Dark mode support
- Responsive design
- Form validation
- Loading states

✅ **Complete Backend**
- 18 API endpoints
- Secure authentication
- Database integration
- Error handling
- Input validation

---

## 🎯 Quick Test Checklist

After both servers are running:

- [ ] Frontend loads at http://localhost:8080
- [ ] Can access login/signup pages
- [ ] Can create new account
- [ ] Data saves to MySQL database
- [ ] Can login with credentials
- [ ] Can see dashboard
- [ ] Can add emergency contacts
- [ ] Can log health checks
- [ ] Can report incidents
- [ ] Can use SOS alert
- [ ] Can view analytics

---

## 📖 Documentation Files

All documentation is included in the project:

1. **PROJECT_README.md** - Complete overview
2. **SETUP_GUIDE.md** - Detailed setup instructions
3. **INTEGRATION_GUIDE.md** - Frontend-backend integration
4. **DEPLOYMENT_GUIDE.md** - Production deployment
5. **QUICK_REFERENCE.md** - Quick reference

---

## 🚀 Next Steps After Running

### Development:
```bash
# Make code changes
# Frontend auto-reloads with hot module replacement
# Backend requires restart for changes
```

### Testing:
```bash
# Use Postman or curl to test API endpoints
curl http://127.0.0.1:5000/api/health
```

### Deployment:
See `DEPLOYMENT_GUIDE.md` for production deployment instructions.

---

## 💡 Pro Tips

1. **Use browser DevTools (F12)** to see network requests
2. **Check console logs** for errors and debug info
3. **Check MySQL** to verify data persistence:
   ```bash
   mysql -u root raah_setu
   SELECT * FROM users;
   ```
4. **Monitor API** responses in Network tab
5. **Check terminal logs** for backend errors

---

## ✨ You're All Set!

Your RAAH-SETU application is ready to run!

### Summary:
- ✅ Frontend: React with modern UI
- ✅ Backend: Flask with 18 endpoints
- ✅ Database: MySQL with 9 tables
- ✅ Authentication: Secure with bcrypt
- ✅ Documentation: Comprehensive guides

### Run Now:
1. Terminal 1: `cd Backend && pip install -r requirements.txt && python create_schema.py && python api_enhanced.py`
2. Terminal 2: `npm install && npm run dev`
3. Browser: Open `http://localhost:8080`

---

**Built with ❤️ for Personal Safety & Wellness**

🛡️ **RAAH-SETU** - Connecting you with help when you need it most. 🛡️

---

**Questions? Check the documentation files or review the troubleshooting section above.**
