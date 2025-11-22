// Quick script to check .env file
require('dotenv').config();

console.log('\n=== Checking .env File ===\n');

const requiredVars = {
  'MONGODB_URI': process.env.MONGODB_URI,
  'JWT_SECRET': process.env.JWT_SECRET,
  'PORT': process.env.PORT,
  'NODE_ENV': process.env.NODE_ENV,
};

let hasErrors = false;

for (const [key, value] of Object.entries(requiredVars)) {
  if (value) {
    if (key === 'MONGODB_URI') {
      console.log(`✅ ${key}: ${value.substring(0, 30)}...`);
    } else if (key === 'JWT_SECRET') {
      console.log(`✅ ${key}: ${value.substring(0, 20)}...`);
    } else {
      console.log(`✅ ${key}: ${value}`);
    }
  } else {
    console.log(`❌ ${key}: NOT SET`);
    hasErrors = true;
  }
}

console.log('\n=== Email Configuration ===\n');
console.log(`EMAIL_SERVICE: ${process.env.EMAIL_SERVICE || 'NOT SET'}`);
console.log(`EMAIL_USER: ${process.env.EMAIL_USER || 'NOT SET'}`);
console.log(`EMAIL_PASSWORD: ${process.env.EMAIL_PASSWORD ? '***SET***' : 'NOT SET'}`);

if (hasErrors) {
  console.log('\n❌ Some required variables are missing!');
  console.log('\nYour .env file should contain:');
  console.log('\nMONGODB_URI=mongodb://localhost:27017/stockmaster');
  console.log('JWT_SECRET=your_secret_key_here');
  console.log('PORT=5000');
  console.log('NODE_ENV=development\n');
  process.exit(1);
} else {
  console.log('\n✅ All required variables are set!\n');
}

