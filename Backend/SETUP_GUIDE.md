# RAAH-SETU Backend Setup Guide

## 📋 Quick Start

This guide will help you set up the backend with MySQL database and connect it with the React frontend.

---

## ✅ Prerequisites

- Python 3.8 or higher
- MySQL Server installed and running
- pip (Python package manager)

---

## 🚀 Step 1: Install Python Dependencies

```bash
cd Backend
pip install -r requirements.txt
```

**Installed Packages:**
- `flask` - Web framework
- `flask-cors` - Handle cross-origin requests
- `mysql-connector-python` - MySQL database connector
- `bcrypt` - Password hashing
- `python-dotenv` - Environment variables

---

## 🗄️ Step 2: Create Database Schema

### Option A: Automatic (Recommended)
```bash
python create_schema.py
```

This will:
- Create database `raah_setu`
- Create 9 tables with proper relationships
- Add foreign keys for data integrity

### Option B: Manual
1. Open MySQL:
```bash
mysql -u root -p
```

2. Execute the SQL from Backend/SETUP.sql (if provided)

---

## 📊 Database Schema

### Created Tables:

1. **users** - User accounts
   - id, name, email, phone, password, profile_picture
   - Timestamps: created_at, updated_at

2. **emergency_contacts** - Emergency contacts per user
   - id, user_id, name, phone, email, relationship, priority

3. **health_checks** - Health monitoring records
   - id, user_id, mood, heart_rate, blood_pressure, location, notes

4. **incidents** - Incident reports
   - id, user_id, title, description, type, severity, location, status

5. **activities** - Activity logs
   - id, user_id, activity_type, description, location

6. **sos_alerts** - SOS emergency alerts
   - id, user_id, location, status, timestamps

7. **alerts** - System alerts
   - id, user_id, alert_type, message, severity, is_read

8. **notifications** - User notifications
   - id, user_id, title, message, is_read

9. **guardians** - Guardian relationships
   - id, user_id, guardian_id, relationship, permissions

---

## 🔌 Step 3: Configure Database Connection

Edit `Backend/api_enhanced.py` and update DB_CONFIG if needed:

```python
DB_CONFIG = {
    "host": "localhost",      # MySQL host
    "user": "root",           # MySQL username
    "password": "",           # MySQL password (empty if none)
    "database": "raah_setu"   # Database name
}
```

Or use environment variables:
```bash
export DB_HOST=localhost
export DB_USER=root
export DB_PASSWORD=
export DB_NAME=raah_setu
```

---

## ▶️ Step 4: Run the Backend Server

```bash
python api_enhanced.py
```

Expected Output:
```
 * Running on http://127.0.0.1:5000 (Press CTRL+C to quit)
```

✅ Backend is now running on `http://127.0.0.1:5000`

---

## 🧪 Step 5: Test the API

### Health Check
```bash
curl http://127.0.0.1:5000/api/health
```

### Create User (Signup)
```bash
curl -X POST http://127.0.0.1:5000/api/auth/signup \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John Doe",
    "email": "john@example.com",
    "phone": "1234567890",
    "password": "SecurePass123!"
  }'
```

### Login
```bash
curl -X POST http://127.0.0.1:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "john@example.com",
    "password": "SecurePass123!"
  }'
```

---

## 📱 Step 6: Connect Frontend to Backend

The frontend is already configured to use the backend API.

### Frontend API Configuration
File: `client/lib/api.ts`

All endpoints are pre-configured:
- ✅ Authentication (signup, login)
- ✅ Emergency Contacts (CRUD)
- ✅ Health Checks
- ✅ Incidents
- ✅ Activities
- ✅ SOS Alerts

### Frontend Environment
File: `client/vite.config.ts` (already configured)

The frontend runs on `http://localhost:8080`

---

## 🔐 Security Notes

### Password Hashing
- All passwords are hashed with `bcrypt`
- Never store plain passwords
- Minimum 8 characters recommended

### Data Encryption
- Implement HTTPS in production
- Use environment variables for sensitive data
- Enable CORS only for trusted origins

### Best Practices
- Change default database password
- Use strong passwords
- Regular database backups
- Monitor for suspicious activities

---

## 📝 API Endpoints Reference

### Authentication
- `POST /api/auth/signup` - Register new user
- `POST /api/auth/login` - Login user

### Emergency Contacts
- `GET /api/emergency-contacts?user_id={id}` - Get all contacts
- `POST /api/emergency-contacts` - Create contact
- `PUT /api/emergency-contacts/{id}` - Update contact
- `DELETE /api/emergency-contacts/{id}` - Delete contact

### Health Checks
- `GET /api/health-checks?user_id={id}` - Get all checks
- `POST /api/health-checks` - Log health check

### Incidents
- `GET /api/incidents?user_id={id}` - Get all incidents
- `POST /api/incidents` - Report incident

### Activities
- `GET /api/activities?user_id={id}` - Get all activities
- `POST /api/activities` - Log activity

### SOS
- `POST /api/sos/activate` - Activate SOS alert

### Utilities
- `GET /api/health` - API health check

---

## 🐛 Troubleshooting

### MySQL Connection Error
```
Error: MySQL server has gone away
```
✅ Solution: Check MySQL is running
```bash
# Windows
net start MySQL80

# macOS
brew services start mysql

# Linux
sudo systemctl start mysql
```

### Port Already in Use
```
OSError: [Errno 48] Address already in use
```
✅ Solution: Change port in `api_enhanced.py`
```python
app.run(debug=True, host='127.0.0.1', port=5001)  # Change 5000 to 5001
```

### CORS Error
```
Access to XMLHttpRequest blocked by CORS policy
```
✅ Solution: Already enabled with `flask-cors`
- Verify `CORS(app)` is present in api_enhanced.py

### Module Not Found
```
ModuleNotFoundError: No module named 'flask'
```
✅ Solution: Install dependencies
```bash
pip install -r requirements.txt
```

---

## 📚 Environment Variables

Create a `.env` file in Backend directory:

```env
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=
DB_NAME=raah_setu
FLASK_ENV=development
FLASK_DEBUG=True
```

---

## 🔄 Full Startup Sequence

### Terminal 1: Backend
```bash
cd Backend
python api_enhanced.py
```
✅ Runs on http://127.0.0.1:5000

### Terminal 2: Frontend
```bash
npm run dev
```
✅ Runs on http://localhost:8080

### Terminal 3: Database (if needed)
```bash
mysql -u root
```

### Browser
- Visit `http://localhost:8080`
- Sign up with new account
- Data saved to MySQL database

---

## 📊 Monitoring

### Check Database
```bash
mysql -u root -e "SELECT * FROM raah_setu.users;"
```

### View Logs
Backend logs show:
- Request received
- Database operations
- Error details

Frontend console shows:
- API calls
- Response data
- Error messages

---

## ✨ Next Steps

1. ✅ Backend setup complete
2. ✅ Database configured
3. ✅ API endpoints ready
4. Next: Run frontend and test authentication
5. Next: Deploy to production (configure HTTPS, use production database, etc.)

---

## 📞 Support

For issues:
1. Check error message in console
2. Review database connection settings
3. Verify all packages installed
4. Check MySQL is running
5. Review API response with curl/Postman

---

## 🎉 You're All Set!

Your RAAH-SETU application is now:
- ✅ Backend API running
- ✅ Database configured with 9 tables
- ✅ Authentication system ready
- ✅ Emergency contacts API active
- ✅ Health checks tracking
- ✅ Incident reporting
- ✅ Activity logging
- ✅ SOS alerts
- ✅ Ready for frontend integration

Start using the app by:
1. Creating an account (Signup)
2. Logging in with credentials
3. Adding emergency contacts
4. Logging health checks
5. Reporting incidents
6. Sharing location with guardians
