# Quick Start - Where to Add MongoDB URI and Email Credentials

## 📍 Location: Create `.env` File

**Create a file named `.env` (exactly this name, no extension) in the `backend` folder.**

The file should be at: `backend/.env` (same folder as `package.json`)

---

## 📝 Step-by-Step Instructions

### Step 1: Create the `.env` File

1. Navigate to the `backend` folder in your project
2. Create a new file named `.env` (no extension, just `.env`)
3. Copy and paste the template below into this file

### Step 2: Add Your MongoDB URI

**Choose ONE option:**

#### Option A: Local MongoDB (if MongoDB is installed on your computer)
```env
MONGODB_URI=mongodb://localhost:27017/stockmaster
```

#### Option B: MongoDB Atlas (Cloud - Free)
```env
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/stockmaster?retryWrites=true&w=majority
```
*Replace `username`, `password`, and `cluster` with your actual MongoDB Atlas credentials*

### Step 3: Add Your Email Credentials

**For Gmail (Recommended):**

1. First, get a Gmail App Password:
   - Go to https://myaccount.google.com/security
   - Enable 2-Step Verification (if not already enabled)
   - Go to "App passwords" section
   - Generate a new app password for "Mail"
   - Copy the 16-character password

2. Add to `.env`:
```env
EMAIL_SERVICE=gmail
EMAIL_USER=your-email@gmail.com
EMAIL_PASSWORD=your-16-character-app-password
```

**For Other Email (SMTP):**
```env
EMAIL_SERVICE=smtp
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_SECURE=false
EMAIL_USER=your-email@gmail.com
EMAIL_PASSWORD=your-password
```

---

## ✅ Complete `.env` File Example

Copy this entire template and fill in your values:

```env
# Server Configuration
NODE_ENV=development
PORT=5000

# MongoDB Connection
# For Local MongoDB:
MONGODB_URI=mongodb://localhost:27017/stockmaster

# OR For MongoDB Atlas (uncomment and use this instead):
# MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/stockmaster?retryWrites=true&w=majority

# JWT Secret (Change this to a random string)
JWT_SECRET=my_super_secret_jwt_key_12345678901234567890

# Email Configuration (Gmail)
EMAIL_SERVICE=gmail
EMAIL_USER=your-email@gmail.com
EMAIL_PASSWORD=your-16-char-app-password

# Email Configuration (SMTP - Alternative)
# EMAIL_SERVICE=smtp
# SMTP_HOST=smtp.gmail.com
# SMTP_PORT=587
# SMTP_SECURE=false
# EMAIL_USER=your-email@gmail.com
# EMAIL_PASSWORD=your-password
```

---

## 🎯 What to Replace

1. **MONGODB_URI**: 
   - Local: `mongodb://localhost:27017/stockmaster` (if MongoDB is running locally)
   - Atlas: `mongodb+srv://YOUR_USERNAME:YOUR_PASSWORD@YOUR_CLUSTER.mongodb.net/stockmaster`

2. **JWT_SECRET**: Any random string (minimum 32 characters recommended)

3. **EMAIL_USER**: Your Gmail address (e.g., `john@gmail.com`)

4. **EMAIL_PASSWORD**: Your Gmail App Password (16 characters, no spaces)

---

## 📂 File Structure Should Look Like This:

```
backend/
├── .env                    ← CREATE THIS FILE HERE
├── package.json
├── server.js
├── app.js
├── config/
├── controllers/
├── models/
└── ...
```

---

## 🧪 Test Your Setup

After creating `.env` file:

1. Install dependencies:
   ```bash
   cd backend
   npm install
   ```

2. Start the server:
   ```bash
   npm run dev
   ```

3. You should see:
   - ✅ `MongoDB Connected: ...` (if MongoDB works)
   - ✅ `Server running in development mode on port 5000`

4. Test email (forgot password):
   ```bash
   POST http://localhost:5000/api/auth/forgot-password
   Body: { "email": "your-email@gmail.com" }
   ```

---

## ⚠️ Important Notes

1. **File Name**: Must be exactly `.env` (not `.env.txt` or `env.txt`)
2. **No Quotes**: Don't use quotes around values in `.env` file
3. **No Spaces**: No spaces around `=` sign
4. **Never Commit**: The `.env` file is in `.gitignore` - never commit it to Git
5. **Gmail App Password**: Use App Password, NOT your regular Gmail password

---

## 🆘 Troubleshooting

### Can't find where to create `.env`?
- It goes in the `backend` folder
- Same folder where `package.json` is located

### MongoDB connection error?
- Make sure MongoDB is running (if local)
- Check your connection string is correct
- For Atlas: Whitelist your IP address

### Email not sending?
- Verify you're using Gmail App Password (not regular password)
- Check spam folder
- Make sure 2-Step Verification is enabled on Gmail

---

## 📚 More Help

See `ENV_SETUP.md` for detailed setup instructions.

