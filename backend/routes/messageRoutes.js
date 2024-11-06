// routes/messageRoutes.js
const express = require('express');
const router = express.Router();
const { Message } = require('../models');

/**
 * @swagger
 * tags:
 *   name: Messages
 *   description: Операции с сообщениями
 */
/**
 * @swagger
 * /api/messages:
 *   post:
 *     summary: Создание сообщения
 *     description: Создает новое сообщение для указанного пользователя и чата
 *     tags: [Messages]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               userId:
 *                 type: integer
 *               chatId:
 *                 type: integer
 *               content:
 *                 type: string
 *     responses:
 *       201:
 *         description: Сообщение успешно создано
 *       500:
 *         description: Ошибка при создании сообщения
 */
router.post('/', async (req, res) => {
    try {
        const { userId, chatId, content } = req.body;
        const message = await Message.create({ userId, chatId, content });
        res.status(201).json(message);
    } catch (error) {
        res.status(500).json({ message: 'Ошибка при создании сообщения', error });
    }
});

/**
 * @swagger
 * /api/messages/{id}:
 *   get:
 *     summary: Чтение сообщения по ID
 *     description: Возвращает сообщение по указанному ID
 *     tags: [Messages]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID сообщения
 *     responses:
 *       200:
 *         description: Успешный ответ с данными сообщения
 *       404:
 *         description: Сообщение не найдено
 *       500:
 *         description: Ошибка при получении сообщения
 */
router.get('/:id', async (req, res) => {
    try {
        const message = await Message.findByPk(req.params.id);
        if (!message) {
            return res.status(404).json({ message: 'Сообщение не найдено' });
        }
        res.json(message);
    } catch (error) {
        res.status(500).json({ message: 'Ошибка при получении сообщения', error });
    }
});

/**
 * @swagger
 * /api/messages/{id}:
 *   put:
 *     summary: Обновление сообщения
 *     description: Обновляет содержание сообщения по указанному ID
 *     tags: [Messages]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID сообщения
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               content:
 *                 type: string
 *     responses:
 *       200:
 *         description: Сообщение успешно обновлено
 *       404:
 *         description: Сообщение не найдено
 *       500:
 *         description: Ошибка при обновлении сообщения
 */
router.put('/:id', async (req, res) => {
    try {
        const message = await Message.findByPk(req.params.id);
        if (!message) {
            return res.status(404).json({ message: 'Сообщение не найдено' });
        }
        const { content } = req.body;
        message.content = content;
        await message.save();
        res.json(message);
    } catch (error) {
        res.status(500).json({ message: 'Ошибка при обновлении сообщения', error });
    }
});

/**
 * @swagger
 * /api/messages/{id}:
 *   delete:
 *     summary: Удаление сообщения
 *     description: Удаляет сообщение по указанному ID
 *     tags: [Messages]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID сообщения
 *     responses:
 *       200:
 *         description: Сообщение успешно удалено
 *       404:
 *         description: Сообщение не найдено
 *       500:
 *         description: Ошибка при удалении сообщения
 */
router.delete('/:id', async (req, res) => {
    try {
        const message = await Message.findByPk(req.params.id);
        if (!message) {
            return res.status(404).json({ message: 'Сообщение не найдено' });
        }
        await message.destroy();
        res.json({ message: 'Сообщение удалено' });
    } catch (error) {
        res.status(500).json({ message: 'Ошибка при удалении сообщения', error });
    }
});

module.exports = router;
