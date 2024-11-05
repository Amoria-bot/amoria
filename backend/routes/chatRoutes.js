// routes/chatRoutes.js

const express = require('express');
const router = express.Router();
const { Chat } = require('../models');

// Создание чата
router.post('/chats', async (req, res) => {
  try {
    const newChat = await Chat.create(req.body);
    res.status(201).json(newChat);
  } catch (error) {
    console.error('Ошибка при создании чата:', error);
    res.status(500).json({ message: 'Ошибка при создании чата', error });
  }
});

// Получение чата по ID
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

// Обновление чата по ID
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

// Удаление чата по ID
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
