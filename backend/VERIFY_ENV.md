# Verify Your .env File Setup

## Check Your .env File

Open your `.env` file in the `backend` folder and make sure it has these lines:

### Required Variables:

```env
MONGODB_URI=mongodb://localhost:27017/stockmaster
```

OR for MongoDB Atlas:

```env
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/stockmaster?retryWrites=true&w=majority
```

## Common Issues:

### 1. Variable Name Typo
❌ Wrong: `MONGODB_URL=...` or `MONGO_URI=...` or `MONGODB_URI =...`
✅ Correct: `MONGODB_URI=mongodb://...`

### 2. Commented Out
❌ Wrong: `# MONGODB_URI=mongodb://...`
✅ Correct: `MONGODB_URI=mongodb://...` (no `#` at the start)

### 3. Extra Spaces
❌ Wrong: `MONGODB_URI = mongodb://...` (spaces around `=`)
✅ Correct: `MONGODB_URI=mongodb://...` (no spaces)

### 4. Quotes (Not Needed)
❌ Wrong: `MONGODB_URI="mongodb://..."`
✅ Correct: `MONGODB_URI=mongodb://...` (no quotes)

### 5. Server Not Restarted
After creating/editing `.env`, you MUST restart the server:
- Stop the server (Ctrl+C)
- Start again: `node server.js` or `npm run dev`

## Quick Test

Add this temporary line to your `server.js` (after `require('dotenv').config()`) to verify:

```javascript
console.log('MONGODB_URI:', process.env.MONGODB_URI);
```

If it shows `undefined`, your `.env` file is not being read correctly.

## Complete .env Template

Your `.env` file should look like this:

```env
NODE_ENV=development
PORT=5000

# MongoDB - Choose ONE:
MONGODB_URI=mongodb://localhost:27017/stockmaster
# OR for Atlas:
# MONGODB_URI=mongodb+srv://user:pass@cluster.mongodb.net/stockmaster?retryWrites=true&w=majority

JWT_SECRET=your_secret_key_here_min_32_characters

EMAIL_SERVICE=gmail
EMAIL_USER=your-email@gmail.com
EMAIL_PASSWORD=your-app-password
```

## Still Not Working?

1. **Check file location**: Must be in `backend` folder (same as `package.json`)
2. **Check file name**: Must be exactly `.env` (not `.env.txt`)
3. **Restart server**: Always restart after editing `.env`
4. **Check MongoDB**: Make sure MongoDB is running (if using local)

