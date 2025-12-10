// src/lib/telegram/bot.ts
import { Telegraf } from 'telegraf';
import { handleLogisticRequest, handleStart } from './telegram';

if (!process.env.TELEGRAM_BOT_TOKEN) {
  throw new Error('TELEGRAM_BOT_TOKEN not found');
}

export const bot = new Telegraf(process.env.TELEGRAM_BOT_TOKEN);

// ⚠️ PENTING: Command handlers HARUS di atas bot.on('text')
bot.command('start', handleStart);
bot.command('help', handleStart);

// Filter bot.on('text') agar tidak handle command
bot.on('text', (ctx, next) => {
  // Cek apakah message adalah command (dimulai dengan /)
  if (ctx.message.text.startsWith('/')) {
    return next(); // Skip, biarkan command handler yang handle
  }
  
  // Bukan command, proses sebagai logistic request
  return handleLogisticRequest(ctx);
});

// Error handling
bot.catch((err, ctx) => {
  console.error('Bot error:', err);
  ctx.reply('Something went wrong');
});


// // src/lib/telegram/bot.ts
// import { Telegraf, Context } from 'telegraf';

// if (!process.env.TELEGRAM_BOT_TOKEN) {
//   throw new Error('TELEGRAM_BOT_TOKEN not found');
// }

// const bot = new Telegraf(process.env.TELEGRAM_BOT_TOKEN);

// // ========================================
// // HANDLERS - Langsung didefinisikan di sini
// // ========================================

// // Start command
// bot.command('start', async (ctx: Context) => {
//   console.log('✅ /start command triggered');
//   console.log('User:', ctx.from?.username);
  
//   const welcomeMessage = `
// 🚚 *Добро пожаловать в Логистический Бот!*

// Я помогу вам зафиксировать ваш логистический запрос.

// *Как пользоваться:*
// - Отправьте сообщение с вашим запросом
// - Бот автоматически сохранит ваш username, дату, время и текст запроса
// - Данные будут сохранены в нашей системе

// *Пример запроса:*
// "Пожалуйста, отправьте посылку в Москву, ул. Тверская, д. 10"

// Отправьте ваш запрос прямо сейчас! 📦
//   `;
  
//   await ctx.reply(welcomeMessage, { parse_mode: 'Markdown' });
// });

// // Help command
// bot.command('help', async (ctx: Context) => {
//   console.log('✅ /help command triggered');
//   await ctx.reply('Используйте /start для начала работы');
// });

// // Text messages (non-commands)
// bot.on('text', async (ctx: Context, next) => {
//    if (!ctx.message || !('text' in ctx.message)) {
//     return next();
//   }
  
//   const text = ctx.message.text || '';
  
//   // Skip commands
//   if (text.startsWith('/')) {
//     console.log('⏭️ Skipping command:', text);
//     return next();
//   }
  
//   console.log('📦 Logistic request received:', text);
//   console.log('From:', ctx.from?.username);
  
//   // TODO: Save to database
  
//   await ctx.reply(
//     `✅ Ваш запрос получен!\n\n` +
//     `Текст: "${text}"\n` +
//     `Время: ${new Date().toLocaleString('ru-RU')}`
//   );
// });

// // Error handler
// bot.catch((err, ctx) => {
//   console.error('❌ Bot error:', err);
//   console.error('Update:', ctx.update);
//   ctx.reply('Произошла ошибка. Попробуйте еще раз.');
// });

// // Log bot info at startup
// bot.telegram.getMe().then((botInfo) => {
//   console.log('🤖 Bot initialized:', botInfo.username);
// }).catch((err) => {
//   console.error('❌ Failed to get bot info:', err);
// });

// // Export configured bot
// export { bot };