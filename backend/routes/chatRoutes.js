// routes/chatRoutes.js

const express = require('express');
const router = express.Router();
const { Chat } = require('../models');

/**
 * @swagger
 * tags:
 *   name: Chats
 *   description: Операции с чатами
 */
/**
 * @swagger
 * /api/chats:
 *   post:
 *     summary: Создание чата
 *     description: Создает новый чат
 *     tags: [Chats]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               userId:
 *                 type: integer
 *               otherUserId:
 *                 type: integer
 *               status:
 *                 type: string
 *     responses:
 *       201:
 *         description: Чат успешно создан
 *       500:
 *         description: Ошибка при создании чата
 */
router.post('/chats', async (req, res) => {
  try {
    const newChat = await Chat.create(req.body);
    res.status(201).json(newChat);
  } catch (error) {
    console.error('Ошибка при создании чата:', error);
    res.status(500).json({ message: 'Ошибка при создании чата', error });
  }
});

/**
 * @swagger
 * /api/chats/{id}:
 *   get:
 *     summary: Получение чата по ID
 *     description: Возвращает чат по указанному ID
 *     tags: [Chats]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID чата
 *     responses:
 *       200:
 *         description: Успешный ответ с данными чата
 *       404:
 *         description: Чат не найден
 *       500:
 *         description: Ошибка при получении чата
 */
router.get('/chats/:id', async (req, res) => {
  try {
    const chat = await Chat.findByPk(req.params.id);
    if (chat) {
      res.json(chat);
    } else {
      res.status(404).json({ message: 'Чат не найден' });
    }
  } catch (error) {
    console.error('Ошибка при получении чата:', error);
    res.status(500).json({ message: 'Ошибка при получении чата', error });
  }
});

/**
 * @swagger
 * /api/chats/{id}:
 *   put:
 *     summary: Обновление чата по ID
 *     description: Обновляет данные чата по указанному ID
 *     tags: [Chats]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID чата
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               status:
 *                 type: string
 *     responses:
 *       200:
 *         description: Чат успешно обновлен
 *       404:
 *         description: Чат не найден
 *       500:
 *         description: Ошибка при обновлении чата
 */
router.put('/chats/:id', async (req, res) => {
  try {
    const chat = await Chat.findByPk(req.params.id);
    if (chat) {
      await chat.update(req.body);
      res.json(chat);
    } else {
      res.status(404).json({ message: 'Чат не найден' });
    }
  } catch (error) {
    console.error('Ошибка при обновлении чата:', error);
    res.status(500).json({ message: 'Ошибка при обновлении чата', error });
  }
});

/**
 * @swagger
 * /api/chats/{id}:
 *   delete:
 *     summary: Удаление чата по ID
 *     description: Удаляет чат по указанному ID
 *     tags: [Chats]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID чата
 *     responses:
 *       200:
 *         description: Чат успешно удален
 *       404:
 *         description: Чат не найден
 *       500:
 *         description: Ошибка при удалении чата
 */
router.delete('/chats/:id', async (req, res) => {
  try {
    const chat = await Chat.findByPk(req.params.id);
    if (chat) {
      await chat.destroy();
      res.json({ message: 'Чат удален' });
    } else {
      res.status(404).json({ message: 'Чат не найден' });
    }
  } catch (error) {
    console.error('Ошибка при удалении чата:', error);
    res.status(500).json({ message: 'Ошибка при удалении чата', error });
  }
});

module.exports = router;
