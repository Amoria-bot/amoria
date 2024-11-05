// routes/messageRoutes.js
const express = require('express');
const router = express.Router();
const { Message } = require('../models');

// Создание сообщения
router.post('/', async (req, res) => {
    try {
        const { userId, chatId, content } = req.body;
        const message = await Message.create({ userId, chatId, content });
        res.status(201).json(message);
    } catch (error) {
        res.status(500).json({ message: 'Ошибка при создании сообщения', error });
    }
});

// Чтение сообщения по ID
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

// Обновление сообщения
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

// Удаление сообщения
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
