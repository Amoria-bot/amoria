// routes/transactionRoutes.js
const express = require('express');
const router = express.Router();
const { Transaction } = require('../models'); // Импортируем модель Transaction

// Создание новой транзакции
router.post('/', async (req, res) => {
  try {
    const newTransaction = await Transaction.create(req.body);
    res.status(201).json(newTransaction);
  } catch (error) {
    console.error('Ошибка при создании транзакции:', error);
    res.status(400).json({ message: 'Ошибка при создании транзакции', error });
  }
});

// Получение транзакции по ID
router.get('/:id', async (req, res) => {
  try {
    const transaction = await Transaction.findByPk(req.params.id);
    if (transaction) {
      res.json(transaction);
    } else {
      res.status(404).json({ message: 'Транзакция не найдена' });
    }
  } catch (error) {
    console.error('Ошибка при получении транзакции:', error);
    res.status(500).json({ message: 'Ошибка сервера', error });
  }
});

// Обновление транзакции по ID
router.put('/:id', async (req, res) => {
  try {
    const transaction = await Transaction.findByPk(req.params.id);
    if (transaction) {
      await transaction.update(req.body);
      res.json(transaction);
    } else {
      res.status(404).json({ message: 'Транзакция не найдена' });
    }
  } catch (error) {
    console.error('Ошибка при обновлении транзакции:', error);
    res.status(500).json({ message: 'Ошибка сервера', error });
  }
});

// Удаление транзакции по ID
router.delete('/:id', async (req, res) => {
  try {
    const transaction = await Transaction.findByPk(req.params.id);
    if (transaction) {
      await transaction.destroy();
      res.json({ message: 'Транзакция удалена' });
    } else {
      res.status(404).json({ message: 'Транзакция не найдена' });
    }
  } catch (error) {
    console.error('Ошибка при удалении транзакции:', error);
    res.status(500).json({ message: 'Ошибка сервера', error });
  }
});

module.exports = router;
