import TelegramBot from 'node-telegram-bot-api';
import dotenv from 'dotenv';
import main from './index.js';

dotenv.config();

const bot = new TelegramBot(process.env.BOT_API_KEY, { polling: true });

// Start command: Show inline button
bot.onText(/\/start/, (msg) => {
  const chatId = msg.chat.id;
  bot.sendMessage(chatId, 'Welcome! Click to check Solana balance:', {
    reply_markup: {
      inline_keyboard: [[
        { text: 'Get Balance', callback_data: 'fetch_balance' }
      ]]
    }
  });
});

// Handle button click
bot.on('callback_query', async (query) => {
  const chatId = query.message.chat.id;
  if (query.data === 'fetch_balance') {
    try {
      const { returnBalance, returnUsdc,  wallet2 } = await main();
      await bot.sendMessage(
        chatId,
        `Balance for ${wallet2}:\n${returnBalance} SOL\n$${returnUsdc} USD`
      );
      await bot.answerCallbackQuery(query.id);
    } catch (error) {
      await bot.sendMessage(chatId, 'Error: ' + error.message);
      await bot.answerCallbackQuery(query.id);
    }
  }
});

console.log('Bot is running...');
