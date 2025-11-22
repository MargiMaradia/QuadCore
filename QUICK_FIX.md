# Quick Fix Guide - Data Not Saving & Email Issues

## 🔍 Step 1: Test Database Connection

Open your browser and visit:
```
http://localhost:5000/api/test/db
```

**What to look for:**
- ✅ `"connected": true` = Database is working
- ❌ `"connected": false` = MongoDB not running or wrong URI

**If not connected:**
1. Check MongoDB is running
2. Verify `.env` has: `MONGODB_URI=mongodb://localhost:27017/stockmaster`
3. Restart server

---

## 🔍 Step 2: Test Email Configuration

Visit:
```
http://localhost:5000/api/test/email
```

**What to look for:**
- ✅ `"configured": true` = Email is set up
- ❌ `"configured": false` = Need to add email credentials

**If not configured:**
1. Add to `.env`:
   ```env
   EMAIL_SERVICE=gmail
   EMAIL_USER=your-email@gmail.com
   EMAIL_PASSWORD=your-app-password
   ```
2. Get Gmail App Password (see below)
3. Restart server

---

## 🔍 Step 3: Check Users in Database

Visit:
```
http://localhost:5000/api/test/users
```

This shows all registered users. If empty after registration, data is not saving.

---

## 📧 Setup Gmail App Password (For Email)

1. Go to: https://myaccount.google.com/security
2. Enable **2-Step Verification**
3. Click **App passwords**
4. Select **Mail** → **Other** → Enter "StockMaster"
5. Click **Generate**
6. Copy the 16-character password (looks like: `abcd-efgh-ijkl-mnop`)
7. Paste in `.env` as `EMAIL_PASSWORD`

**Important:** Use App Password, NOT your regular Gmail password!

---

## 🧪 Test Registration

1. **Register a user** through the frontend or:
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

2. **Check server console** for:
   - "User created successfully: [id]"

3. **Verify in database:**
   - Visit: `http://localhost:5000/api/test/users`
   - You should see the user listed

---

## 🧪 Test Password Reset

1. **Request OTP:**
   ```bash
   POST http://localhost:5000/api/auth/forgot-password
   Content-Type: application/json
   
   {
     "email": "your-email@gmail.com"
   }
   ```

2. **Check server console** for:
   - "Generating OTP for user: [email]"
   - "OTP saved to database"
   - "Email sent successfully" OR error

3. **In Development Mode:**
   - Response includes `otp` field
   - Use that OTP to test reset

---

## ✅ Complete .env File

Make sure your `backend/.env` has:

```env
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

## 🐛 Common Issues & Fixes

### Data Not Saving

**Problem:** Users not appearing in database

**Solutions:**
1. Check MongoDB is running
2. Test: `GET /api/test/db` - should show "connected: true"
3. Check server logs for errors
4. Verify MONGODB_URI in .env

### Email Not Sending

**Problem:** OTP email not received

**Solutions:**
1. Test: `GET /api/test/email` - should show "configured: true"
2. Use Gmail App Password (not regular password)
3. Check spam folder
4. In development, OTP is in response

### Server Errors

**Check server console for:**
- ❌ "MongoDB Connection Error" → Fix MONGODB_URI
- ❌ "Email configuration missing" → Add email to .env
- ❌ "User already exists" → User was saved (try different email)

---

## 📋 Verification Checklist

After setup, verify:

- [ ] `GET /api/test/db` shows "connected: true"
- [ ] `GET /api/test/email` shows "configured: true"
- [ ] Registration creates user (check `/api/test/users`)
- [ ] Login works with registered user
- [ ] Password reset sends email (check server logs)
- [ ] OTP can be used to reset password

---

## 🆘 Still Not Working?

1. **Check server console** - Look for error messages
2. **Test endpoints** - Use the test routes above
3. **Verify .env** - All variables set correctly
4. **Restart server** - After any .env changes
5. **Check MongoDB** - Is it running?

See `TROUBLESHOOTING.md` for detailed help.

