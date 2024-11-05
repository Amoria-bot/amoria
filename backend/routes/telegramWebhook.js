const express = require('express');
const axios = require('axios');
const router = express.Router();

// Основной маршрут для обработки webhook
router.post('/telegram-webhook', async (req, res) => {
  console.log('Received update:', req.body); // Логируем все полученные обновления

  // Проверяем, есть ли сообщение
  if (req.body.message) {
    const chatId = req.body.message.chat.id;
    const text = req.body.message.text;

    // Пример обработки команды /start
    if (text === '/start') {
      await sendMessage(chatId, 'Добро пожаловать в Amoria! Как я могу вам помочь?');
    } else {
      await sendMessage(chatId, `Вы сказали: ${text}`);
    }
  }

  res.sendStatus(200); // Подтверждаем получение запроса
});

// Функция для отправки сообщения обратно пользователю
async function sendMessage(chatId, text) {
  const BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN;
  try {
    await axios.post(`https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`, {
      chat_id: chatId,
      text: text
    });
  } catch (error) {
    console.error('Ошибка при отправке сообщения:', error);
  }
}

module.exports = router;
