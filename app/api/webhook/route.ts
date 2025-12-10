// src/app/api/webhook/route.ts
import { GoogleSheetsService } from '@/shared/lib';
import { bot } from '@/shared/lib/Setupbot';
import { NextRequest, NextResponse } from 'next/server';

const sheetsService = new GoogleSheetsService();

// Initialize sheet saat startup
sheetsService.initializeSheet().catch(console.error);

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // Process update dari Telegram
    await bot.handleUpdate(body);
    
    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error('Webhook error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// Untuk testing/health check
export async function GET() {
  return NextResponse.json({ status: 'Bot is running' });
}