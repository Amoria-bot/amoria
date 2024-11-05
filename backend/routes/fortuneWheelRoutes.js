// routes/fortuneWheelRoutes.js
const express = require('express');
const router = express.Router();
const { FortuneWheelProgress } = require('../models');

// Создание записи FortuneWheelProgress
router.post('/', async (req, res) => {
    try {
        const { userId, spinCount, lastSpinTime } = req.body;
        const fortuneWheelProgress = await FortuneWheelProgress.create({ userId, spinCount, lastSpinTime });
        res.status(201).json(fortuneWheelProgress);
    } catch (error) {
        res.status(500).json({ message: 'Ошибка при создании записи FortuneWheelProgress', error });
    }
});

// Получение записи FortuneWheelProgress по userId
router.get('/:userId', async (req, res) => {
    try {
        const fortuneWheelProgress = await FortuneWheelProgress.findOne({ where: { userId: req.params.userId } });
        if (!fortuneWheelProgress) {
            return res.status(404).json({ message: 'Запись FortuneWheelProgress не найдена' });
        }
        res.json(fortuneWheelProgress);
    } catch (error) {
        res.status(500).json({ message: 'Ошибка при получении записи FortuneWheelProgress', error });
    }
});

// Обновление записи FortuneWheelProgress
router.put('/:userId', async (req, res) => {
    try {
        const fortuneWheelProgress = await FortuneWheelProgress.findOne({ where: { userId: req.params.userId } });
        if (!fortuneWheelProgress) {
            return res.status(404).json({ message: 'Запись FortuneWheelProgress не найдена' });
        }
        const { spinCount, lastSpinTime } = req.body;
        fortuneWheelProgress.spinCount = spinCount ?? fortuneWheelProgress.spinCount;
        fortuneWheelProgress.lastSpinTime = lastSpinTime ?? fortuneWheelProgress.lastSpinTime;
        await fortuneWheelProgress.save();
        res.json(fortuneWheelProgress);
    } catch (error) {
        res.status(500).json({ message: 'Ошибка при обновлении записи FortuneWheelProgress', error });
    }
});

// Удаление записи FortuneWheelProgress
router.delete('/:userId', async (req, res) => {
    try {
        const fortuneWheelProgress = await FortuneWheelProgress.findOne({ where: { userId: req.params.userId } });
        if (!fortuneWheelProgress) {
            return res.status(404).json({ message: 'Запись FortuneWheelProgress не найдена' });
        }
        await fortuneWheelProgress.destroy();
        res.json({ message: 'Запись FortuneWheelProgress удалена' });
    } catch (error) {
        res.status(500).json({ message: 'Ошибка при удалении записи FortuneWheelProgress', error });
    }
});

module.exports = router;
