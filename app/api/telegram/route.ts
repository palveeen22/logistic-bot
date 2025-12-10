// app/api/telegram/route.ts

import { bot } from "@/shared/lib";

let webhookInitialized = false;

async function initializeWebhook() {
  if (webhookInitialized) return;

  const baseUrl = process.env.BASE_URL || process.env.VERCEL_URL;

  console.log(baseUrl);
  
  if (!baseUrl) {
    console.error('❌ BASE_URL or VERCEL_URL not set');
    return;
  }

  try {
    const webhookUrl = `${baseUrl}/api/telegram`;
    const info = await bot.telegram.getWebhookInfo();

    console.log('Current webhook URL:', info.url);
    console.log('Target webhook URL:', webhookUrl);

    if (info.url !== webhookUrl) {
      console.log('🔧 Setting webhook...');
      await bot.telegram.setWebhook(webhookUrl);
      console.log('✅ Webhook set successfully');
    } else {
      console.log('✅ Webhook already correct');
    }

    webhookInitialized = true;
  } catch (error) {
    console.error('❌ Webhook setup failed:', error);
  }
}

export const POST = async (req: Request) => {
  // Initialize webhook on first request
  await initializeWebhook();

  console.log('=' .repeat(60));
  console.log('🔔 Webhook called at:', new Date().toISOString());

  try {
    const body = await req.json();
    
    console.log('📦 Update received:');
    console.log(JSON.stringify(body, null, 2));

    // Handle the update
    await bot.handleUpdate(body);

    console.log('✅ Update processed successfully');
    return new Response('OK', { status: 200 });
    
  } catch (error) {
    console.error('❌ Error processing update:');
    console.error(error);
    
    // Tetap return 200 agar Telegram tidak retry
    return new Response('Error processed', { status: 200 });
  }
};

// Manual webhook setup endpoint
export const GET = async () => {
  const baseUrl = process.env.BASE_URL || process.env.VERCEL_URL;

  if (!baseUrl) {
    return Response.json(
      { error: 'BASE_URL or VERCEL_URL not set' },
      { status: 500 }
    );
  }

  try {
    const webhookUrl = `${baseUrl}/api/telegram`;
    
    // Set webhook
    await bot.telegram.setWebhook(webhookUrl);
    
    // Get info
    const info = await bot.telegram.getWebhookInfo();
    const botInfo = await bot.telegram.getMe();

    return Response.json({
      success: true,
      bot: botInfo,
      webhook: {
        url: info.url,
        hasCustomCertificate: info.has_custom_certificate,
        pendingUpdateCount: info.pending_update_count,
        lastErrorDate: info.last_error_date,
        lastErrorMessage: info.last_error_message,
        maxConnections: info.max_connections,
      },
    });
  } catch (error) {
    return Response.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
};