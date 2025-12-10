// src/lib/telegram/handlers.ts
import { Context } from 'telegraf';
import { LogisticRequest } from '../types';
import { GoogleSheetsService } from './GoogleSheets';

const sheetsService = new GoogleSheetsService();

export async function handleLogisticRequest(ctx: Context): Promise<void> {
  try {
    const username = ctx.from?.username || 'unknown';
    const userId = ctx.from?.id || 0;
    const chatId = ctx.chat?.id || 0;
    const requestContent = ctx.message && 'text' in ctx.message 
      ? ctx.message.text 
      : '';

    // Валидация ввода
    if (!requestContent || requestContent.trim() === '') {
      await ctx.reply('❌ Пожалуйста, отправьте текст вашего запроса.');
      return;
    }

    const logisticRequest: LogisticRequest = {
      username,
      timestamp: new Date(),
      requestContent,
      userId,
      chatId,
    };

    // Отправка в Google Sheets
    await sheetsService.appendLogisticRequest(logisticRequest);

    // Подтверждение пользователю
    await ctx.reply(
      `✅ Ваш запрос был успешно сохранён!\n\n` +
      `📦 Детали:\n` +
      `👤 Пользователь: @${username}\n` +
      `📅 Дата: ${logisticRequest.timestamp.toLocaleDateString('ru-RU')}\n` +
      `🕐 Время: ${logisticRequest.timestamp.toLocaleTimeString('ru-RU')}\n` +
      `📝 Запрос: ${requestContent}\n\n` +
      `Спасибо! Наша команда скоро обработает ваш запрос.`
    );
  } catch (error) {
    console.error('Error handling logistic request:', error);
    await ctx.reply('❌ Произошла ошибка. Пожалуйста, попробуйте позже.');
  }
}

export async function handleStart(ctx: Context): Promise<void> {
  console.log('in');
  const welcomeMessage = `
🚚 *Добро пожаловать в Логистический Бот!*

Я помогу вам зафиксировать ваш логистический запрос.

*Как пользоваться:*
- Отправьте сообщение с вашим запросом
- Бот автоматически сохранит ваш username, дату, время и текст запроса
- Данные будут сохранены в нашей системе

*Пример запроса:*
"Пожалуйста, отправьте посылку в Москву, ул. Тверская, д. 10"

Отправьте ваш запрос прямо сейчас! 📦
  `;
  
  await ctx.reply(welcomeMessage, { parse_mode: 'Markdown' });
}
