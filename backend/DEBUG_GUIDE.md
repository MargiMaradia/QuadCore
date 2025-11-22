# Debug Guide - Data Not Saving & Email Issues

## Quick Diagnostic Steps

### 1. Test Database Connection
Open browser or Postman and visit:
```
GET http://localhost:5000/api/test/db
```

**Expected Response:**
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

**If you see "disconnected":**
- MongoDB is not running
- MONGODB_URI is wrong
- Check server console for connection errors

### 2. Test Email Configuration
```
GET http://localhost:5000/api/test/email
```

**Expected Response:**
```json
{
  "configured": true,
  "config": {
    "emailService": "gmail",
    "emailUser": "set",
    "emailPassword": "set"
  }
}
```

**If configured: false:**
- Add EMAIL_USER and EMAIL_PASSWORD to .env
- Restart server

### 3. Check Users in Database
```
GET http://localhost:5000/api/test/users
```

This shows all registered users. If empty, registration is not saving.

---

## Fixing Data Not Saving

### Step 1: Verify MongoDB Connection
1. Check server console when starting:
   ```
   ✅ MongoDB Connected: localhost:27017
   📊 Database: stockmaster
   ```

2. If you see connection error:
   - Start MongoDB service
   - Check MONGODB_URI in .env
   - Restart server

### Step 2: Test Registration
```bash
POST http://localhost:5000/api/auth/register
Content-Type: application/json

{
  "fullName": "Test User",
  "email": "test@example.com",
  "password": "test123",
  "role": "warehouse_staff"
}
```

**Check server console for:**
- "User created successfully: [id]"
- Any error messages

**Then verify:**
```bash
GET http://localhost:5000/api/test/users
```

You should see the user in the list.

### Step 3: Common Issues

**Issue: "User already exists"**
- User was saved successfully before
- Try different email

**Issue: "Validation error"**
- Check all required fields are provided
- Check password length (min 6 chars)

**Issue: "Database connection error"**
- MongoDB not running
- Wrong MONGODB_URI
- Check server logs

---

## Fixing Email Not Sending

### Step 1: Check Email Configuration
```bash
GET http://localhost:5000/api/test/email
```

### Step 2: Setup Gmail App Password

1. Go to: https://myaccount.google.com/security
2. Enable **2-Step Verification** (if not enabled)
3. Go to **App passwords**
4. Select **Mail** and **Other (Custom name)**
5. Enter "StockMaster" as name
6. Click **Generate**
7. Copy the 16-character password

### Step 3: Update .env File
```env
EMAIL_SERVICE=gmail
EMAIL_USER=your-email@gmail.com
EMAIL_PASSWORD=abcd-efgh-ijkl-mnop
```

**Important:**
- Use App Password, NOT your regular Gmail password
- No spaces in the password
- Restart server after updating .env

### Step 4: Test Password Reset

1. Request password reset:
   ```bash
   POST http://localhost:5000/api/auth/forgot-password
   Content-Type: application/json
   
   {
     "email": "your-email@gmail.com"
   }
   ```

2. **Check server console for:**
   - "Generating OTP for user: [email]"
   - "OTP saved to database"
   - "Attempting to send email to: [email]"
   - "Email sent successfully" OR error message

3. **In Development Mode:**
   - OTP is also returned in response
   - Check response for `otp` field
   - Use that OTP to test reset

### Step 5: Common Email Issues

**Issue: "Email configuration missing"**
- Add EMAIL_USER and EMAIL_PASSWORD to .env
- Restart server

**Issue: "Invalid login credentials"**
- Using regular password instead of App Password
- Generate new App Password

**Issue: "Connection timeout"**
- Check internet connection
- Check firewall settings
- Try different email provider

**Issue: Email goes to spam**
- Check spam/junk folder
- Mark as not spam

---

## Server Console Messages to Look For

### Successful Registration:
```
User created successfully: 507f1f77bcf86cd799439011
```

### Successful Email:
```
Generating OTP for user: user@example.com, OTP: 123456
OTP saved to database for user: user@example.com
Attempting to send email to: user@example.com
Creating email transporter...
Email transporter verified successfully
Email sent:  <message-id>
Email sent successfully to: user@example.com
```

### Errors to Watch For:
```
❌ MongoDB Connection Error: ...
❌ Email configuration missing!
❌ Error sending email: ...
```

---

## Complete .env File Checklist

```env
# Server
NODE_ENV=development
PORT=5000

# Database (REQUIRED)
MONGODB_URI=mongodb://localhost:27017/stockmaster

# JWT (REQUIRED)
JWT_SECRET=your_super_secret_jwt_key_min_32_characters

# Email (REQUIRED for password reset)
EMAIL_SERVICE=gmail
EMAIL_USER=your-email@gmail.com
EMAIL_PASSWORD=your-16-char-app-password
```

---

## Testing Checklist

- [ ] MongoDB is running
- [ ] MONGODB_URI is correct in .env
- [ ] Server shows "MongoDB Connected"
- [ ] `/api/test/db` returns "connected: true"
- [ ] Registration creates user (check `/api/test/users`)
- [ ] EMAIL_USER and EMAIL_PASSWORD set in .env
- [ ] Using Gmail App Password (not regular password)
- [ ] Server restarted after .env changes
- [ ] `/api/test/email` returns "configured: true"
- [ ] Password reset sends email (check server logs)

---

## Still Not Working?

1. **Check server console** - Look for error messages
2. **Test endpoints** - Use `/api/test/db` and `/api/test/email`
3. **Check MongoDB** - Connect directly and verify database exists
4. **Check .env file** - Ensure all variables are set correctly
5. **Restart everything** - Server, MongoDB, browser

For detailed troubleshooting, see `TROUBLESHOOTING.md`

