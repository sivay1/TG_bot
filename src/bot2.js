import TelegramBot from 'node-telegram-bot-api';
import dotenv from 'dotenv';
import main from './index.js';

dotenv.config();

const bot = new TelegramBot(process.env.BOT_API_KEY, { polling: true });

let mainMessage = null;


// Start command: Show inline button
bot.onText(/\/start/, async(msg) => {
  const chatId = msg.chat.id;
  const sent = await bot.sendMessage(chatId, 'Welcome! Click to check Solana balance:', {
    reply_markup: {
      inline_keyboard: [[
        { text: 'Get Balance', callback_data: 'fetch_balance' }
      ]]
    }
  });

  mainMessage = {
  chatId : chatId,
  messageId : sent.message_id
};
});



// Handle button click
bot.on('callback_query', async (query) => {
  const chatId = query.message.chat.id;
  

  if (query.data === 'fetch_balance' && mainMessage) {
    try {
      const { returnBalance, returnUsdc,  wallet2 } = await main();

      const now = new Date().toLocaleTimeString(); 
      const newText = `Balance for ${wallet2}:\n${returnBalance} SOL\n$${returnUsdc} USD\n\n⏰ Last updated: ${now}`;

      await bot.editMessageText(newText,{
        chat_id: mainMessage.chatId,
        message_id: mainMessage.messageId,
        reply_markup: {
        inline_keyboard: [
          [{ text: "💰 Refresh Balance", callback_data: "fetch_balance" }]
        ]
      }
    }  
      );
      await bot.answerCallbackQuery(query.id);
    } catch (error) {
      const errorText = `❌ Error: ${error.message}\n⏰ ${new Date().toLocaleTimeString()}`;
      await bot.editMessageText(errorText, {
        chat_id: mainMessage.chatId,
        message_id: mainMessage.messageId
      });


      await bot.answerCallbackQuery(query.id);
    }
  }
});

console.log('Bot is running...');