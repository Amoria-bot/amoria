const express = require('express');
const axios = require('axios');
const router = express.Router();

const CHANNEL_ID = '@amoria_community'; // Укажите ID вашего канала
const BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN;

/**
 * @swagger
 * tags:
 *   name: BotTests
 *   description: Тестовые операции с ботом
 */
/**
 * @swagger
 * /api/check-subscription:
 *   post:
 *     summary: Проверка подписки пользователя на канал Telegram
 *     description: Проверяет, подписан ли указанный пользователь на канал Telegram.
 *     tags: [BotTests]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               telegramUserId:
 *                 type: integer
 *                 description: ID пользователя в Telegram
 *     responses:
 *       200:
 *         description: Статус подписки пользователя
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 message:
 *                   type: string
 *       500:
 *         description: Ошибка при проверке подписки
 */
router.post('/check-subscription', async (req, res) => {
  const { telegramUserId } = req.body;

  try {
    // Запрос к Telegram API для проверки подписки пользователя на канал
    const response = await axios.get(`https://api.telegram.org/bot${BOT_TOKEN}/getChatMember`, {
      params: {
        chat_id: CHANNEL_ID,
        user_id: telegramUserId
      }
    });

    const status = response.data.result.status;

    // Проверка статуса подписки
    if (status === 'member' || status === 'administrator' || status === 'creator') {
      res.json({ success: true, message: 'User is subscribed' });
    } else {
      res.json({ success: false, message: 'User is not subscribed' });
    }
  } catch (error) {
    console.error('Error checking subscription:', error);
    res.status(500).json({ success: false, message: 'Error checking subscription' });
  }
});

module.exports = router;
