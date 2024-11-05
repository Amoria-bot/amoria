// routes/amocoinBalanceRoutes.js
const express = require('express');
const router = express.Router();
const { AmocoinBalance } = require('../models');

// Создание баланса пользователя
router.post('/', async (req, res) => { // Изменен путь на '/'
    try {
        const { userId, balance } = req.body;
        const amocoinBalance = await AmocoinBalance.create({ userId, balance });
        res.status(201).json(amocoinBalance);
    } catch (error) {
        res.status(500).json({ message: 'Ошибка при создании баланса', error });
    }
});

// Получение баланса по userId
router.get('/:userId', async (req, res) => { // Изменен путь на '/:userId'
    try {
        const amocoinBalance = await AmocoinBalance.findOne({ where: { userId: req.params.userId } });
        if (!amocoinBalance) {
            return res.status(404).json({ message: 'Баланс не найден' });
        }
        res.json(amocoinBalance);
    } catch (error) {
        res.status(500).json({ message: 'Ошибка при получении баланса', error });
    }
});

// Обновление баланса
router.put('/:userId', async (req, res) => { // Изменен путь на '/:userId'
    try {
        const amocoinBalance = await AmocoinBalance.findOne({ where: { userId: req.params.userId } });
        if (!amocoinBalance) {
            return res.status(404).json({ message: 'Баланс не найден' });
        }
        const { balance } = req.body;
        amocoinBalance.balance = balance ?? amocoinBalance.balance;
        await amocoinBalance.save();
        res.json(amocoinBalance);
    } catch (error) {
        res.status(500).json({ message: 'Ошибка при обновлении баланса', error });
    }
});

// Удаление баланса
router.delete('/:userId', async (req, res) => { // Изменен путь на '/:userId'
    try {
        const amocoinBalance = await AmocoinBalance.findOne({ where: { userId: req.params.userId } });
        if (!amocoinBalance) {
            return res.status(404).json({ message: 'Баланс не найден' });
        }
        await amocoinBalance.destroy();
        res.json({ message: 'Баланс удален' });
    } catch (error) {
        res.status(500).json({ message: 'Ошибка при удалении баланса', error });
    }
});

module.exports = router;
