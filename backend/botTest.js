// botTest.js
require('dotenv').config();
const TelegramBot = require('node-telegram-bot-api');

const token = process.env.TELEGRAM_BOT_TOKEN;
console.log("Загруженный токен:", token); // проверка токена

if (!token) {
    console.error("Токен бота не найден! Проверьте файл .env");
    process.exit(1);
}

const bot = new TelegramBot(token, { polling: true });
console.log("Бот инициализирован и ожидает сообщений..."); // сообщение об инициализации

bot.on('message', (msg) => {
    console.log("Получено сообщение:", msg.text); // для отслеживания сообщений в терминале
    bot.sendMessage(msg.chat.id, 'Бот успешно работает!');
});
