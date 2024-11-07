// routes/subscriptionRoutes.js

const express = require('express');
const router = express.Router();
const { Subscription, User } = require('../models'); // Импортируем модели Subscription и User

/**
 * @swagger
 * tags:
 *   name: Subscriptions
 *   description: Операции с подписками
 */
/**
 * @swagger
 * /api/subscriptions/{userId}:
 *   get:
 *     summary: Получение подписки по ID пользователя
 *     description: Возвращает подписку для указанного пользователя
 *     tags: [Subscriptions]
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID пользователя
 *     responses:
 *       200:
 *         description: Успешный ответ с данными подписки
 *       404:
 *         description: Подписка не найдена
 *       500:
 *         description: Ошибка сервера
 */
router.get('/subscriptions/:userId', async (req, res) => {
  try {
    const subscription = await Subscription.findOne({
      where: { userId: req.params.userId },
      include: [{ model: User, as: 'user', attributes: ['telegramId'] }],
    });
    if (subscription) {
      res.json(subscription);
    } else {
      res.json({ status: 'inactive' }); // Возвращаем статус 'inactive' если подписка не найдена
    }
  } catch (error) {
    console.error('Ошибка при получении подписки:', error);
    res.status(500).json({ message: 'Ошибка сервера', error });
  }
});

/**
 * @swagger
 * /api/subscriptions:
 *   post:
 *     summary: Создание подписки для пользователя
 *     description: Создает новую подписку для пользователя
 *     tags: [Subscriptions]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               userId:
 *                 type: integer
 *               status:
 *                 type: string
 *                 description: Состояние подписки (active или expired)
 *               duration:
 *                 type: string
 *                 enum: [1_month, 1_year]
 *                 description: Длительность подписки
 *               expiresOn:
 *                 type: string
 *                 format: date-time
 *                 description: Дата окончания подписки
 *     responses:
 *       201:
 *         description: Подписка успешно создана
 *       400:
 *         description: Ошибка при создании подписки
 */
router.post('/subscriptions', async (req, res) => {
  try {
    const { userId, status, duration, expiresOn } = req.body;
    const newSubscription = await Subscription.create({
      userId,
      status,
      duration,
      expiresOn,
    });
    res.status(201).json(newSubscription);
  } catch (error) {
    console.error('Ошибка при создании подписки:', error);
    res.status(400).json({ message: 'Ошибка при создании подписки', error });
  }
});

/**
 * @swagger
 * /api/subscriptions/{id}:
 *   put:
 *     summary: Обновление подписки
 *     description: Обновляет данные подписки по ID
 *     tags: [Subscriptions]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID подписки
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               status:
 *                 type: string
 *                 description: Состояние подписки (active или expired)
 *               duration:
 *                 type: string
 *                 enum: [1_month, 1_year]
 *                 description: Длительность подписки
 *               expiresOn:
 *                 type: string
 *                 format: date-time
 *                 description: Дата окончания подписки
 *     responses:
 *       200:
 *         description: Подписка успешно обновлена
 *       404:
 *         description: Подписка не найдена
 *       500:
 *         description: Ошибка сервера
 */
router.put('/subscriptions/:id', async (req, res) => {
  try {
    const { status, duration, expiresOn } = req.body;
    const subscription = await Subscription.findByPk(req.params.id);
    if (subscription) {
      await subscription.update({ status, duration, expiresOn });
      res.json(subscription);
    } else {
      res.status(404).json({ message: 'Подписка не найдена' });
    }
  } catch (error) {
    console.error('Ошибка при обновлении подписки:', error);
    res.status(500).json({ message: 'Ошибка сервера', error });
  }
});

/**
 * @swagger
 * /api/subscriptions/{id}:
 *   delete:
 *     summary: Удаление подписки
 *     description: Удаляет подписку по ID
 *     tags: [Subscriptions]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID подписки
 *     responses:
 *       200:
 *         description: Подписка успешно удалена
 *       404:
 *         description: Подписка не найдена
 *       500:
 *         description: Ошибка сервера
 */
router.delete('/subscriptions/:id', async (req, res) => {
  try {
    const subscription = await Subscription.findByPk(req.params.id);
    if (subscription) {
      await subscription.destroy();
      res.json({ message: 'Подписка удалена' });
    } else {
      res.status(404).json({ message: 'Подписка не найдена' });
    }
  } catch (error) {
    console.error('Ошибка при удалении подписки:', error);
    res.status(500).json({ message: 'Ошибка сервера', error });
  }
});

module.exports = router;
