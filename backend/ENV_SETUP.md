# Environment Variables Setup Guide

## Where to Add MongoDB URI

Create a `.env` file in the `backend` folder (same level as `package.json`) and add your configuration.

## Step-by-Step Setup

### 1. Create .env File

In the `backend` folder, create a new file named `.env` (no extension).

### 2. Add MongoDB URI

Copy the template below and update with your MongoDB connection string:

```env
# Server Configuration
NODE_ENV=development
PORT=5000

# MongoDB Connection
# Option 1: Local MongoDB
MONGODB_URI=mongodb://localhost:27017/stockmaster

# Option 2: MongoDB Atlas (Cloud)
# MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/stockmaster?retryWrites=true&w=majority

# JWT Secret (Change this to a random string in production)
JWT_SECRET=your_super_secret_jwt_key_change_this_in_production_min_32_characters

# Email Configuration
# Option 1: Gmail (Recommended for development)
EMAIL_SERVICE=gmail
EMAIL_USER=your-email@gmail.com
EMAIL_PASSWORD=your-app-password

# Option 2: SMTP (Generic)
# EMAIL_SERVICE=smtp
# SMTP_HOST=smtp.gmail.com
# SMTP_PORT=587
# SMTP_SECURE=false
# EMAIL_USER=your-email@gmail.com
# EMAIL_PASSWORD=your-password
```

## MongoDB Setup Options

### Option 1: Local MongoDB

1. **Install MongoDB** on your computer
2. **Start MongoDB service**
3. Use: `mongodb://localhost:27017/stockmaster`

### Option 2: MongoDB Atlas (Cloud - Free)

1. Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Create a free account
3. Create a new cluster
4. Create a database user
5. Whitelist your IP address (or use `0.0.0.0/0` for development)
6. Get connection string: `mongodb+srv://username:password@cluster.mongodb.net/stockmaster`

## Email Setup

### Gmail Setup (Recommended for Development)

1. **Enable 2-Step Verification** on your Gmail account
2. **Generate App Password**:
   - Go to Google Account → Security
   - Under "2-Step Verification", click "App passwords"
   - Generate a new app password for "Mail"
   - Copy the 16-character password
3. **Add to .env**:
   ```env
   EMAIL_SERVICE=gmail
   EMAIL_USER=your-email@gmail.com
   EMAIL_PASSWORD=your-16-char-app-password
   ```

### Other Email Providers (SMTP)

For Outlook, Yahoo, or custom SMTP:

```env
EMAIL_SERVICE=smtp
SMTP_HOST=smtp.office365.com  # or your SMTP host
SMTP_PORT=587
SMTP_SECURE=false
EMAIL_USER=your-email@domain.com
EMAIL_PASSWORD=your-password
```

## Security Notes

1. **Never commit `.env` file** to Git (it's already in `.gitignore`)
2. **Use strong JWT_SECRET** in production (minimum 32 characters)
3. **Use App Passwords** for Gmail, not your regular password
4. **Keep MongoDB credentials secure**

## Testing Your Setup

After setting up `.env`, test the connection:

```bash
npm run dev
```

You should see:
- `MongoDB Connected: ...` (if MongoDB connection works)
- Server running on port 5000

## Troubleshooting

### MongoDB Connection Error
- Check if MongoDB is running (local) or cluster is active (Atlas)
- Verify connection string is correct
- Check if IP is whitelisted (for Atlas)

### Email Not Sending
- Verify email credentials
- For Gmail: Make sure you're using App Password, not regular password
- Check spam folder
- Verify SMTP settings if using custom SMTP

### Port Already in Use
- Change `PORT` in `.env` to a different port (e.g., 5001)

