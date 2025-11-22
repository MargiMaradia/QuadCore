# How to Fix "MongoDB URI is undefined" Error

## What the Error Means

The error `The uri parameter to openUri() must be a string, got "undefined"` means:
- Your `.env` file is missing or doesn't have `MONGODB_URI` set
- The application can't find your MongoDB connection string
- MongoDB doesn't know where to connect

## Solution: Create `.env` File

### Step 1: Create the File

1. Go to the `backend` folder
2. Create a new file named `.env` (exactly this name, no extension)

### Step 2: Copy This Content

Copy and paste this into your `.env` file:

```env
# Server Configuration
NODE_ENV=development
PORT=5000

# MongoDB Connection
# Option 1: Local MongoDB (if MongoDB is installed on your computer)
MONGODB_URI=mongodb://localhost:27017/stockmaster

# Option 2: MongoDB Atlas (Cloud - uncomment and use this instead)
# MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/stockmaster?retryWrites=true&w=majority

# JWT Secret
JWT_SECRET=my_super_secret_jwt_key_12345678901234567890

# Email Configuration (Gmail)
EMAIL_SERVICE=gmail
EMAIL_USER=your-email@gmail.com
EMAIL_PASSWORD=your-app-password-here
```

### Step 3: Update MongoDB URI

**If you have MongoDB installed locally:**
- Keep: `MONGODB_URI=mongodb://localhost:27017/stockmaster`
- Make sure MongoDB is running on your computer

**If you're using MongoDB Atlas (Cloud):**
1. Comment out the local line (add `#` at the start)
2. Uncomment the Atlas line (remove `#`)
3. Replace `username`, `password`, and `cluster` with your actual values:
   ```env
   MONGODB_URI=mongodb+srv://myusername:mypassword@cluster0.abc123.mongodb.net/stockmaster?retryWrites=true&w=majority
   ```

### Step 4: Update Email (Optional for now)

You can leave email settings as-is for now, or update them:
- `EMAIL_USER`: Your Gmail address
- `EMAIL_PASSWORD`: Your Gmail App Password (get from Google Account settings)

### Step 5: Save and Restart

1. Save the `.env` file
2. Stop the server (Ctrl+C)
3. Start again: `node server.js` or `npm run dev`

## Quick Test

After creating `.env`, you should see:
```
MongoDB Connected: localhost:27017
Server running in development mode on port 5000
```

## Still Getting Error?

1. **Check file name**: Must be exactly `.env` (not `.env.txt` or `env.txt`)
2. **Check location**: File must be in `backend` folder (same as `package.json`)
3. **Check MongoDB**: 
   - Local: Make sure MongoDB service is running
   - Atlas: Check your connection string is correct
4. **Restart server**: After creating `.env`, always restart the server

## File Location

Your file structure should be:
```
backend/
├── .env          ← This file must exist here
├── package.json
├── server.js
└── ...
```

