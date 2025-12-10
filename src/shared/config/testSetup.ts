// scripts/testSetup.ts
import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

console.log('🧪 Testing Setup...\n');

// Check 1: Telegram Token
if (process.env.TELEGRAM_BOT_TOKEN) {
  console.log('✅ TELEGRAM_BOT_TOKEN: Found');
} else {
  console.log('❌ TELEGRAM_BOT_TOKEN: Missing');
}

// Check 2: Sheets ID
if (process.env.GOOGLE_SHEETS_ID) {
  console.log('✅ GOOGLE_SHEETS_ID: Found');
  console.log(`   → ${process.env.GOOGLE_SHEETS_ID}`);
} else {
  console.log('❌ GOOGLE_SHEETS_ID: Missing');
}

// Check 3: Service Account Email
if (process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL) {
  console.log('✅ GOOGLE_SERVICE_ACCOUNT_EMAIL: Found');
  console.log(`   → ${process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL}`);
} else {
  console.log('❌ GOOGLE_SERVICE_ACCOUNT_EMAIL: Missing');
}

// Check 4: Private Key (improved check)
if (process.env.GOOGLE_PRIVATE_KEY) {
  const key = process.env.GOOGLE_PRIVATE_KEY;
  
  if (key.includes('BEGIN PRIVATE KEY') && key.includes('END PRIVATE KEY')) {
    console.log('✅ GOOGLE_PRIVATE_KEY: Found & Valid format');
  } else {
    console.log('⚠️  GOOGLE_PRIVATE_KEY: Found but invalid format');
  }
  
  // Check for \n (as literal string, not actual newline)
  const hasBackslashN = key.includes('\\n');
  const hasActualNewline = key.split('\n').length > 1;
  
  if (hasBackslashN || hasActualNewline) {
    console.log('✅ GOOGLE_PRIVATE_KEY: Contains newline characters');
  } else {
    console.log('⚠️  GOOGLE_PRIVATE_KEY: Missing newline characters');
  }
} else {
  console.log('❌ GOOGLE_PRIVATE_KEY: Missing');
}

console.log('\n📋 Setup Summary:');
console.log('─'.repeat(50));

const allSet = 
  process.env.TELEGRAM_BOT_TOKEN &&
  process.env.GOOGLE_SHEETS_ID &&
  process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL &&
  process.env.GOOGLE_PRIVATE_KEY;

if (allSet) {
  console.log('🎉 All credentials are set!');
  console.log('\n📝 Next steps:');
  console.log('1. ✅ Make sure you shared Google Sheet with:');
  console.log(`   ${process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL}`);
  console.log('2. Test Google Sheets connection');
  console.log('3. Run: npm run dev');
  console.log('4. Test the bot in Telegram');
} else {
  console.log('⚠️  Some credentials are missing. Please check above.');
}