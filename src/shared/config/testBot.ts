import dotenv from 'dotenv';
import { Telegraf } from 'telegraf';
import { LogisticRequest } from '../types/logistic';
import { GoogleSheetsService } from '../lib/GoogleSheets';

dotenv.config({ path: '.env.local' });

const bot = new Telegraf(process.env.TELEGRAM_BOT_TOKEN!);
const sheetsService = new GoogleSheetsService();

// Start command
bot.command('start', async (ctx) => {
  const welcomeMessage = `
🚚 *Selamat datang di Bot Logistik!*

Saya siap membantu Anda mencatat request logistik.

*Cara penggunaan:*
- Kirim pesan berisi request Anda
- Bot akan otomatis mencatat username, tanggal, jam, dan isi request
- Data akan tersimpan di Google Sheets

*Contoh request:*
"Tolong kirim paket ke Jakarta, alamat Jl. Sudirman No. 123"

Silakan kirim request Anda sekarang! 📦
  `;
  
  await ctx.reply(welcomeMessage, { parse_mode: 'Markdown' });
});

bot.command('help', async (ctx) => {
  await ctx.reply(
    '🚚 *Bot Logistik Help*\n\n' +
    'Kirimkan pesan berisi request logistik Anda.\n' +
    'Contoh: "Kirim paket ke Bandung, Jl. Asia Afrika 123"\n\n' +
    'Bot akan otomatis mencatat ke sistem.',
    { parse_mode: 'Markdown' }
  );
});

// Handle all text messages
bot.on('text', async (ctx) => {
  try {
    const username = ctx.from?.username || 'unknown';
    const userId = ctx.from?.id || 0;
    const chatId = ctx.chat?.id || 0;
    const requestContent = ctx.message.text;

    console.log(`📨 Request dari @${username}: ${requestContent}`);

    const logisticRequest: LogisticRequest = {
      username,
      timestamp: new Date(),
      requestContent,
      userId,
      chatId,
    };

    // Kirim ke Google Sheets
    await sheetsService.appendLogisticRequest(logisticRequest);

    // Konfirmasi ke user
    await ctx.reply(
      `✅ *Request Anda telah dicatat!*\n\n` +
      `📦 *Detail:*\n` +
      `👤 Username: @${username}\n` +
      `📅 Tanggal: ${logisticRequest.timestamp.toLocaleDateString('id-ID')}\n` +
      `🕐 Jam: ${logisticRequest.timestamp.toLocaleTimeString('id-ID')}\n` +
      `📝 Request: ${requestContent}\n\n` +
      `Terima kasih! Tim kami akan segera memproses.`,
      { parse_mode: 'Markdown' }
    );

    console.log('✅ Request berhasil dicatat ke Google Sheets');
  } catch (error) {
    console.error('❌ Error handling request:', error);
    await ctx.reply('❌ Terjadi kesalahan. Mohon coba lagi nanti.');
  }
});

// Error handling
bot.catch((err, ctx) => {
  console.error('❌ Bot error:', err);
  ctx.reply('Terjadi kesalahan dalam memproses permintaan Anda.');
});

// Start bot in polling mode
console.log('🤖 Starting bot in polling mode...');
console.log('📱 Open Telegram and send a message to your bot\n');

bot.launch();

// Enable graceful stop
process.once('SIGINT', () => bot.stop('SIGINT'));
process.once('SIGTERM', () => bot.stop('SIGTERM'));