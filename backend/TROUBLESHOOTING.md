# Troubleshooting Guide

## Issue: Data Not Being Stored in Database

### Check 1: Database Connection
Test if MongoDB is connected:
```bash
GET http://localhost:5000/api/test/db
```

Expected response:
```json
{
  "status": "connected",
  "connected": true,
  "database": "stockmaster",
  "host": "localhost:27017",
  "userCount": 0,
  "message": "Database connection successful"
}
```

**If not connected:**
1. Check if MongoDB is running
2. Verify `MONGODB_URI` in `.env` file
3. Check MongoDB connection string format

### Check 2: Verify Users in Database
```bash
GET http://localhost:5000/api/test/users
```

This will show all users in the database.

### Check 3: Test Registration
```bash
POST http://localhost:5000/api/auth/register
Content-Type: application/json

{
  "fullName": "Test User",
  "email": "test@example.com",
  "password": "password123",
  "role": "warehouse_staff"
}
```

**Check server logs** for:
- "User created successfully: [id]"
- Any error messages

### Common Issues:

1. **MongoDB not running**
   - Start MongoDB service
   - For Windows: Check Services
   - For Linux: `sudo systemctl start mongod`

2. **Wrong MONGODB_URI**
   - Local: `mongodb://localhost:27017/stockmaster`
   - Atlas: `mongodb+srv://user:pass@cluster.mongodb.net/stockmaster`

3. **Database connection error in logs**
   - Check MongoDB is accessible
   - Check firewall settings
   - Verify credentials (for Atlas)

---

## Issue: Email Not Sending

### Check 1: Email Configuration
Test email configuration:
```bash
GET http://localhost:5000/api/test/email
```

Expected response:
```json
{
  "configured": true,
  "config": {
    "emailService": "gmail",
    "emailUser": "set",
    "emailPassword": "set"
  },
  "message": "Email configuration found"
}
```

**If not configured:**
1. Add to `.env`:
   ```env
   EMAIL_SERVICE=gmail
   EMAIL_USER=your-email@gmail.com
   EMAIL_PASSWORD=your-app-password
   ```

2. Restart server after updating `.env`

### Check 2: Gmail App Password Setup

1. Go to https://myaccount.google.com/security
2. Enable 2-Step Verification
3. Go to "App passwords"
4. Generate password for "Mail"
5. Copy 16-character password
6. Use in `.env` as `EMAIL_PASSWORD`

### Check 3: Test Email Sending

When you request password reset, check server logs for:
- "Generating OTP for user: [email]"
- "OTP saved to database"
- "Attempting to send email to: [email]"
- "Email sent successfully" OR error message

### Common Issues:

1. **Email credentials not set**
   - Add `EMAIL_USER` and `EMAIL_PASSWORD` to `.env`
   - Restart server

2. **Using regular Gmail password**
   - Must use App Password, not regular password
   - Generate App Password from Google Account

3. **Email service error**
   - Check server logs for specific error
   - Verify email credentials are correct
   - Check spam folder

4. **Development mode**
   - In development, OTP is returned in response
   - Check response for `otp` field

---

## Debugging Steps

### Step 1: Check Server Logs
Look for:
- Database connection messages
- User creation messages
- Email sending messages
- Error messages

### Step 2: Test Endpoints
Use these test endpoints:
- `GET /api/test/db` - Test database
- `GET /api/test/email` - Test email config
- `GET /api/test/users` - List all users

### Step 3: Verify .env File
Make sure `.env` has:
```env
MONGODB_URI=mongodb://localhost:27017/stockmaster
JWT_SECRET=your_secret_key
EMAIL_SERVICE=gmail
EMAIL_USER=your-email@gmail.com
EMAIL_PASSWORD=your-app-password
```

### Step 4: Check Database Directly
Connect to MongoDB and check:
```javascript
use stockmaster
db.users.find()
```

---

## Quick Fixes

### If data not saving:
1. Check MongoDB connection: `GET /api/test/db`
2. Verify `.env` has correct `MONGODB_URI`
3. Check server logs for errors
4. Restart server

### If email not sending:
1. Check email config: `GET /api/test/email`
2. Verify Gmail App Password is set
3. Check server logs for email errors
4. In development, OTP is returned in response

### If registration fails:
1. Check all required fields are provided
2. Check email is unique
3. Check password is at least 6 characters
4. Check server logs for specific error

---

## Still Having Issues?

1. **Check server console** for error messages
2. **Test database connection** using `/api/test/db`
3. **Test email configuration** using `/api/test/email`
4. **Check MongoDB** is running and accessible
5. **Verify .env file** has all required variables
6. **Restart server** after any .env changes

