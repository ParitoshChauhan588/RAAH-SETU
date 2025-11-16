# RAAH-SETU Authentication Guide

## 🔐 Login & Signup System

The RAAH-SETU application now has a fully functional authentication system with login and signup pages.

### Getting Started

1. **Access the Application**
   - Frontend: http://localhost:8080/
   - Backend API: http://127.0.0.1:5000

2. **Landing Page**
   - Visit the home page at `/` to see the landing page
   - Click "Get Started" or navigate to signup/login pages

### Signup Flow

1. Go to **http://localhost:8080/signup**
2. Fill in the registration form:
   - **Full Name**: Your complete name (min 2 characters)
   - **Email**: Valid email address with @ and domain
   - **Phone**: 10-digit phone number (e.g., 9876543210)
   - **Password**: At least 6 characters
   - **Confirm Password**: Must match password field
   - **Accept Terms**: Check the checkbox to accept T&C

3. Click "Create Account"
4. Upon successful signup, you'll be redirected to login page
5. Login with your registered credentials

### Login Flow

1. Go to **http://localhost:8080/login**
2. Enter your credentials:
   - **Email**: Registered email address
   - **Password**: Your account password
3. Optional: Check "Remember me" to stay logged in
4. Click "Login to Dashboard"
5. Upon success, you'll be redirected to the dashboard

### Test Credentials

For quick testing, you can use:

```
Email: test@example.com
Password: hashed_password
```

To signup your own account, use the signup page with any valid details.

### Protected Routes

The following routes are protected and require login:

- `/dashboard` - Main dashboard
- `/alerts` - Alerts page
- `/profile` - User profile
- `/settings` - Settings page
- `/activity` - Activity history
- `/health` - Health checks
- `/map` - Live map
- `/sos` - SOS alerts
- `/guardians` - Guardians management
- `/emergency-contacts` - Emergency contacts
- `/incidents` - Incident reports
- `/analytics` - Analytics dashboard
- `/safety-tips` - Safety tips
- `/notifications` - Notifications

If you try to access these without logging in, you'll be redirected to the login page.

### Features

✅ **Account Management**
- Create new accounts with email, name, and phone
- Login with email and password
- Remember me functionality
- User session management

✅ **Security**
- Form validation for all fields
- Password confirmation
- Protected routes
- Session-based authentication
- Token-based API access

✅ **User Experience**
- Beautiful modern UI with gradients
- Real-time form validation
- Error messages and success alerts
- Loading states during authentication
- Logout button in navigation bar

### API Endpoints

**Authentication Endpoints:**

```
POST /api/auth/signup
  Body: { name, email, phone, password }
  Response: { success, user: { id, name, email, phone } }

POST /api/auth/login
  Body: { email, password }
  Response: { success, token, user: { id, name, email, phone } }

GET /api/auth/me
  Response: { user: { id, name, email, phone } }

POST /api/auth/logout
  Response: { success, message }
```

### Troubleshooting

**Issue: Connection error when logging in/signing up**
- Make sure backend server is running on port 5000
- Check if frontend is on http://localhost:8080
- Restart both servers if needed

**Issue: Protected route redirects to login**
- You need to login first to access protected pages
- Your session may have expired
- Check browser console for any errors

**Issue: Can't find signup page**
- Navigate directly to http://localhost:8080/signup
- Or click "Sign up here" link on the login page

### Frontend Storage

User data is stored locally in browser:

```javascript
// User session
localStorage.getItem('user') // Returns: { id, name, email, phone }

// Authentication token
localStorage.getItem('token') // Returns: token string

// Remember me preference
localStorage.getItem('rememberMe') // Returns: 'true' if checked
```

### Next Steps

1. ✅ Complete signup/login process
2. ✅ Add emergency contacts
3. ✅ Set up guardians
4. ✅ Enable location tracking
5. ✅ Configure health checks
6. ✅ Explore SOS features

---

**Version:** 1.0.0
**Last Updated:** November 2025
