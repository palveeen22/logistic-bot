/* eslint-disable @typescript-eslint/no-explicit-any */
// testGoogleConnection.ts
import dotenv from 'dotenv';
import { google } from 'googleapis';

dotenv.config({ path: '.env.local' });

async function testConnection() {
  console.log('🧪 Testing Google Sheets Connection...\n');

  try {
    // Validate env vars
    if (!process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL) {
      throw new Error('❌ GOOGLE_SERVICE_ACCOUNT_EMAIL not found in .env.local');
    }
    if (!process.env.GOOGLE_PRIVATE_KEY) {
      throw new Error('❌ GOOGLE_PRIVATE_KEY not found in .env.local');
    }
    if (!process.env.GOOGLE_SHEETS_ID) {
      throw new Error('❌ GOOGLE_SHEETS_ID not found in .env.local');
    }

    console.log('📧 Service Account:', process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL);
    console.log('📊 Sheet ID:', process.env.GOOGLE_SHEETS_ID);
    console.log('');

    // Setup auth
    const auth = new google.auth.GoogleAuth({
      credentials: {
        client_email: process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL,
        private_key: process.env.GOOGLE_PRIVATE_KEY.replace(/\\n/g, '\n'),
      },
      scopes: ['https://www.googleapis.com/auth/spreadsheets'],
    });

    const sheets = google.sheets({ version: 'v4', auth });
    const spreadsheetId = process.env.GOOGLE_SHEETS_ID;

    // Test 1: Initialize headers
    console.log('📝 Step 1: Checking/creating sheet headers...');
    
    try {
      const checkResponse = await sheets.spreadsheets.values.get({
        spreadsheetId,
        range: 'Sheet1!A1:E1',
      });

      if (!checkResponse.data.values || checkResponse.data.values.length === 0) {
        await sheets.spreadsheets.values.update({
          spreadsheetId,
          range: 'Sheet1!A1:E1',
          valueInputOption: 'USER_ENTERED',
          requestBody: {
            values: [['Username', 'Tanggal', 'Jam', 'Isi Request', 'User ID']],
          },
        });
        console.log('✅ Headers created successfully!');
      } else {
        console.log('✅ Headers already exist!');
      }
    } catch (error: any) {
      if (error.code === 403) {
        throw new Error('Permission denied - Sheet not shared with service account');
      }
      throw error;
    }

    // Test 2: Write test data
    console.log('\n📝 Step 2: Writing test data...');
    
    const now = new Date();
    const testData = [[
      'test_user',
      now.toLocaleDateString('id-ID'),
      now.toLocaleTimeString('id-ID'),
      'Test request from connection script - Bot is working! 🎉',
      '12345',
    ]];

    await sheets.spreadsheets.values.append({
      spreadsheetId,
      range: 'Sheet1!A:E',
      valueInputOption: 'USER_ENTERED',
      requestBody: {
        values: testData,
      },
    });

    console.log('✅ Write successful!');

    // Test 3: Read back data
    console.log('\n📝 Step 3: Reading data back...');
    const readResponse = await sheets.spreadsheets.values.get({
      spreadsheetId,
      range: 'Sheet1!A:E',
    });

    const rowCount = readResponse.data.values?.length || 0;
    console.log(`✅ Read successful! Found ${rowCount} rows`);

    console.log('\n' + '='.repeat(60));
    console.log('🎉 ALL TESTS PASSED!');
    console.log('='.repeat(60));
    console.log('\n✅ Your bot can now write to Google Sheets');
    console.log('\n📋 Open your Google Sheet to verify:');
    console.log(`   https://docs.google.com/spreadsheets/d/${spreadsheetId}/edit`);
    console.log('\n🚀 Next step: Start development with npm run dev');

  } catch (error: any) {
    console.error('\n' + '='.repeat(60));
    console.error('❌ CONNECTION FAILED');
    console.error('='.repeat(60) + '\n');

    if (error.message?.includes('invalid_grant') || error.message?.includes('Invalid JWT')) {
      console.log('💡 Issue: Authentication failed');
      console.log('\n   Possible causes:');
      console.log('   1. Private key format is incorrect');
      console.log('   2. Service account email is wrong');
      console.log('\n   Solution:');
      console.log('   • Check GOOGLE_PRIVATE_KEY has proper \\n characters');
      console.log('   • Verify GOOGLE_SERVICE_ACCOUNT_EMAIL matches JSON file');

    } else if (
      error.message?.includes('Permission denied') ||
      error.message?.includes('forbidden') ||
      error.code === 403
    ) {
      console.log('💡 Issue: SHEET NOT SHARED WITH SERVICE ACCOUNT');
      console.log('\n   ⚠️  This is the most common issue!');
      console.log('\n   Step-by-step solution:');
      console.log('   1. Open your Google Sheet:');
      console.log(`      https://docs.google.com/spreadsheets/d/${process.env.GOOGLE_SHEETS_ID}/edit`);
      console.log('\n   2. Click the green "Share" button (top right corner)');
      console.log('\n   3. In the "Add people and groups" field, paste:');
      console.log(`      ${process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL}`);
      console.log('\n   4. In the dropdown, select: "Editor"');
      console.log('\n   5. UNCHECK the box "Notify people"');
      console.log('\n   6. Click "Share" or "Send"');
      console.log('\n   7. Run this test again: npm run test:google');

    } else if (error.message?.includes('not found') || error.code === 404) {
      console.log('💡 Issue: Sheet ID not found');
      console.log('\n   Solution: Verify your GOOGLE_SHEETS_ID');
      console.log(`   Current: ${process.env.GOOGLE_SHEETS_ID}`);
      console.log('\n   How to get correct ID:');
      console.log('   1. Open your Google Sheet');
      console.log('   2. Look at the URL:');
      console.log('      https://docs.google.com/spreadsheets/d/[THIS_IS_THE_ID]/edit');
      console.log('   3. Copy the ID and update .env.local');

    } else {
      console.log('❌ Unexpected error:');
      console.log('\n   Error message:', error.message);
      if (error.code) console.log('   Error code:', error.code);
      console.log('\n   Full error details:');
      console.log(error);
    }
    
    console.log('\n' + '='.repeat(60));
  }
}

testConnection();