# Fix Your .env File - Step by Step

## The Problem

Your `.env` file exists but `MONGODB_URI` is not being read. This usually means:
1. The variable name is wrong or has a typo
2. The line is commented out (starts with `#`)
3. There are extra spaces
4. The file has encoding issues

## Quick Fix

### Step 1: Open your `.env` file

Open `backend/.env` in your code editor.

### Step 2: Make sure it has EXACTLY this line:

```env
MONGODB_URI=mongodb://localhost:27017/stockmaster
```

**Important:**
- No spaces around `=`
- No quotes
- No `#` at the start
- Exact spelling: `MONGODB_URI` (not `MONGODB_URL` or `MONGO_URI`)

### Step 3: Complete .env File Template

Copy this ENTIRE content into your `.env` file (replace everything):

```env
NODE_ENV=development
PORT=5000
MONGODB_URI=mongodb://localhost:27017/stockmaster
JWT_SECRET=my_super_secret_jwt_key_12345678901234567890
EMAIL_SERVICE=gmail
EMAIL_USER=your-email@gmail.com
EMAIL_PASSWORD=your-app-password-here
```

### Step 4: Test Your .env File

Run this command to check if variables are loaded:

```bash
node check-env.js
```

This will show you which variables are set and which are missing.

### Step 5: Restart Server

After fixing `.env`:
1. Stop server (Ctrl+C)
2. Start again: `node server.js`

## Common Mistakes

### ❌ Wrong Examples:

```env
# MONGODB_URI=mongodb://...          ← Commented out (has #)
MONGODB_URI = mongodb://...          ← Has spaces around =
MONGODB_URL=mongodb://...            ← Wrong variable name
"MONGODB_URI"="mongodb://..."       ← Has quotes
MONGO_URI=mongodb://...              ← Wrong variable name
```

### ✅ Correct:

```env
MONGODB_URI=mongodb://localhost:27017/stockmaster
```

## For MongoDB Atlas Users

If you're using MongoDB Atlas (cloud), use:

```env
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/stockmaster?retryWrites=true&w=majority
```

Replace:
- `username` with your MongoDB username
- `password` with your MongoDB password  
- `cluster` with your cluster name

## Still Not Working?

1. **Delete and recreate** the `.env` file
2. **Check file encoding**: Should be UTF-8 (not UTF-16)
3. **Check file location**: Must be in `backend` folder
4. **Check file name**: Must be exactly `.env` (not `.env.txt`)

