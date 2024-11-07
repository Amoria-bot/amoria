// routes/userRoutes.js

const express = require('express');
const router = express.Router();
const { User, Subscription } = require('../models'); // Импортируем обе модели

/**
 * @swagger
 * tags:
 *   name: Users
 *   description: Операции с пользователями
 */

/**
 * @swagger
 * /api/users:
 *   get:
 *     summary: Получение всех пользователей
 *     description: Возвращает список всех пользователей
 *     tags: [Users]
 *     responses:
 *       200:
 *         description: Успешный ответ с массивом пользователей
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: integer
 *                   telegramId:
 *                     type: integer
 *                   balance:
 *                     type: integer
 *                   subscription:
 *                     type: object
 *                     properties:
 *                       status:
 *                         type: string
 *                       duration:
 *                         type: string
 *                   createdAt:
 *                     type: string
 *                     format: date-time
 *                   updatedAt:
 *                     type: string
 *                     format: date-time
 *       500:
 *         description: Ошибка сервера
 */
router.get('/users', async (req, res) => {
  try {
    const users = await User.findAll({
      include: {
        model: Subscription,
        as: 'subscription', // Используем alias 'subscription'
        attributes: ['status', 'duration'],
      },
    });
    res.json(users);
  } catch (error) {
    console.error('Ошибка при получении пользователей:', error);
    res.status(500).json({ message: 'Ошибка сервера' });
  }
});

/**
 * @swagger
 * /api/users/{id}:
 *   get:
 *     summary: Получение пользователя по ID
 *     description: Возвращает данные пользователя по указанному ID
 *     tags: [Users]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID пользователя
 *     responses:
 *       200:
 *         description: Успешный ответ с данными пользователя
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: integer
 *                 telegramId:
 *                   type: integer
 *                 balance:
 *                   type: integer
 *                 subscription:
 *                   type: object
 *                   properties:
 *                     status:
 *                       type: string
 *                     duration:
 *                       type: string
 *                 createdAt:
 *                   type: string
 *                   format: date-time
 *                 updatedAt:
 *                   type: string
 *                   format: date-time
 *       404:
 *         description: Пользователь не найден
 *       500:
 *         description: Ошибка сервера
 */
router.get('/users/:id', async (req, res) => {
  try {
    const user = await User.findByPk(req.params.id, {
      include: {
        model: Subscription,
        as: 'subscription', // Используем alias 'subscription'
        attributes: ['status', 'duration'],
      },
    });
    if (user) {
      res.json(user);
    } else {
      res.status(404).json({ message: 'Пользователь не найден' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Ошибка сервера', error });
  }
});

/**
 * @swagger
 * /api/users:
 *   post:
 *     summary: Создание нового пользователя
 *     description: Создает нового пользователя на основе переданных данных
 *     tags: [Users]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               telegramId:
 *                 type: integer
 *                 description: Уникальный Telegram ID пользователя
 *               balance:
 *                 type: integer
 *                 description: Начальный баланс пользователя
 *     responses:
 *       201:
 *         description: Пользователь успешно создан
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: integer
 *                 telegramId:
 *                   type: integer
 *                 balance:
 *                   type: integer
 *                 createdAt:
 *                   type: string
 *                   format: date-time
 *                 updatedAt:
 *                   type: string
 *                   format: date-time
 *       400:
 *         description: Ошибка при создании пользователя
 */
router.post('/users', async (req, res) => {
  try {
    const newUser = await User.create(req.body);
    res.status(201).json(newUser);
  } catch (error) {
    res.status(400).json({ message: 'Ошибка при создании пользователя', error });
  }
});

/**
 * @swagger
 * /api/users/{id}:
 *   put:
 *     summary: Обновление пользователя по ID
 *     description: Обновляет данные пользователя по указанному ID
 *     tags: [Users]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID пользователя
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               balance:
 *                 type: integer
 *                 description: Новый баланс пользователя
 *     responses:
 *       200:
 *         description: Данные пользователя успешно обновлены
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: integer
 *                 telegramId:
 *                   type: integer
 *                 balance:
 *                   type: integer
 *                 createdAt:
 *                   type: string
 *                   format: date-time
 *                 updatedAt:
 *                   type: string
 *                   format: date-time
 *       404:
 *         description: Пользователь не найден
 *       500:
 *         description: Ошибка сервера
 */
router.put('/users/:id', async (req, res) => {
  try {
    const user = await User.findByPk(req.params.id);
    if (user) {
      await user.update(req.body);
      res.json(user);
    } else {
      res.status(404).json({ message: 'Пользователь не найден' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Ошибка сервера', error });
  }
});

/**
 * @swagger
 * /api/users/{id}:
 *   delete:
 *     summary: Удаление пользователя по ID
 *     description: Удаляет пользователя по указанному ID
 *     tags: [Users]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID пользователя
 *     responses:
 *       200:
 *         description: Пользователь успешно удален
 *       404:
 *         description: Пользователь не найден
 *       500:
 *         description: Ошибка сервера
 */
router.delete('/users/:id', async (req, res) => {
  try {
    const user = await User.findByPk(req.params.id);
    if (user) {
      await user.destroy();
      res.json({ message: 'Пользователь удален' });
    } else {
      res.status(404).json({ message: 'Пользователь не найден' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Ошибка сервера', error });
  }
});

module.exports = router;
