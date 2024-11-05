// routes/subscriptionRoutes.js

const express = require('express');
const router = express.Router();
const { Subscription, User } = require('../models'); // Импортируем модели Subscription и User

// Получение подписки по ID пользователя
router.get('/subscriptions/:userId', async (req, res) => {
  try {
    const subscription = await Subscription.findOne({
      where: { userId: req.params.userId },
    });
    if (subscription) {
      res.json(subscription);
    } else {
      res.status(404).json({ message: 'Подписка не найдена' });
    }
  } catch (error) {
    console.error('Ошибка при получении подписки:', error);
    res.status(500).json({ message: 'Ошибка сервера', error });
  }
});

// Создание подписки для пользователя
router.post('/subscriptions', async (req, res) => {
  try {
    const { userId, status, expiresOn } = req.body;
    const newSubscription = await Subscription.create({
      userId,
      status,
      expiresOn,
    });
    res.status(201).json(newSubscription);
  } catch (error) {
    console.error('Ошибка при создании подписки:', error);
    res.status(400).json({ message: 'Ошибка при создании подписки', error });
  }
});

// Обновление подписки
router.put('/subscriptions/:id', async (req, res) => {
  try {
    const subscription = await Subscription.findByPk(req.params.id);
    if (subscription) {
      await subscription.update(req.body);
      res.json(subscription);
    } else {
      res.status(404).json({ message: 'Подписка не найдена' });
    }
  } catch (error) {
    console.error('Ошибка при обновлении подписки:', error);
    res.status(500).json({ message: 'Ошибка сервера', error });
  }
});

// Удаление подписки
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
