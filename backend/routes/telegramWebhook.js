// routes/telegramWebhook.js
const express = require('express');
const axios = require('axios');
const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: TelegramWebhook
 *   description: Операции с webhook Telegram
 */
/**
 * @swagger
 * /api/telegram-webhook:
 *   post:
 *     summary: Основной маршрут для обработки Telegram Webhook
 *     description: Обрабатывает обновления, полученные от Telegram Webhook, и отправляет ответное сообщение в зависимости от содержимого сообщения.
 *     tags: [TelegramWebhook]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               message:
 *                 type: object
 *                 properties:
 *                   chat:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: integer
 *                   text:
 *                     type: string
 *     responses:
 *       200:
 *         description: Запрос успешно обработан
 */
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
