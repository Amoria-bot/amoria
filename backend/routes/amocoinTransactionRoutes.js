// routes/amocoinTransactionRoutes.js
const express = require('express');
const router = express.Router();
const { AmocoinTransaction } = require('../models');

// Создание транзакции Amocoin
router.post('/amocoin-transaction', async (req, res) => {
    try {
        const { userId, amount, type, source, status } = req.body;
        const amocoinTransaction = await AmocoinTransaction.create({ userId, amount, type, source, status });
        res.status(201).json(amocoinTransaction);
    } catch (error) {
        res.status(500).json({ message: 'Ошибка при создании транзакции Amocoin', error });
    }
});

// Получение транзакции Amocoin по ID
router.get('/amocoin-transaction/:id', async (req, res) => {
    try {
        const amocoinTransaction = await AmocoinTransaction.findByPk(req.params.id);
        if (!amocoinTransaction) {
            return res.status(404).json({ message: 'Транзакция Amocoin не найдена' });
        }
        res.json(amocoinTransaction);
    } catch (error) {
        res.status(500).json({ message: 'Ошибка при получении транзакции Amocoin', error });
    }
});

// Получение всех транзакций Amocoin для конкретного пользователя
router.get('/amocoin-transaction/user/:userId', async (req, res) => {
    try {
        const amocoinTransactions = await AmocoinTransaction.findAll({ where: { userId: req.params.userId } });
        if (amocoinTransactions.length === 0) {
            return res.status(404).json({ message: 'Транзакции Amocoin для пользователя не найдены' });
        }
        res.json(amocoinTransactions);
    } catch (error) {
        res.status(500).json({ message: 'Ошибка при получении транзакций Amocoin для пользователя', error });
    }
});

// Обновление транзакции Amocoin
router.put('/amocoin-transaction/:id', async (req, res) => {
    try {
        const amocoinTransaction = await AmocoinTransaction.findByPk(req.params.id);
        if (!amocoinTransaction) {
            return res.status(404).json({ message: 'Транзакция Amocoin не найдена' });
        }
        const { amount, type, source, status } = req.body;
        amocoinTransaction.amount = amount ?? amocoinTransaction.amount;
        amocoinTransaction.type = type ?? amocoinTransaction.type;
        amocoinTransaction.source = source ?? amocoinTransaction.source;
        amocoinTransaction.status = status ?? amocoinTransaction.status;
        await amocoinTransaction.save();
        res.json(amocoinTransaction);
    } catch (error) {
        res.status(500).json({ message: 'Ошибка при обновлении транзакции Amocoin', error });
    }
});

// Удаление транзакции Amocoin
router.delete('/amocoin-transaction/:id', async (req, res) => {
    try {
        const amocoinTransaction = await AmocoinTransaction.findByPk(req.params.id);
        if (!amocoinTransaction) {
            return res.status(404).json({ message: 'Транзакция Amocoin не найдена' });
        }
        await amocoinTransaction.destroy();
        res.json({ message: 'Транзакция Amocoin удалена' });
    } catch (error) {
        res.status(500).json({ message: 'Ошибка при удалении транзакции Amocoin', error });
    }
});

module.exports = router;
