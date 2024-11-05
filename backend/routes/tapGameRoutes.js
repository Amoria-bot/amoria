// routes/tapGameRoutes.js
const express = require('express');
const router = express.Router();
const { TapGameProgress } = require('../models');

// Создание записи TapGameProgress
router.post('/', async (req, res) => {
    try {
        const { userId, tapCount, lastTapTime, cooldownEnd, totalTapsPlayed } = req.body;
        const tapGameProgress = await TapGameProgress.create({ userId, tapCount, lastTapTime, cooldownEnd, totalTapsPlayed });
        res.status(201).json(tapGameProgress);
    } catch (error) {
        res.status(500).json({ message: 'Ошибка при создании записи TapGameProgress', error });
    }
});

// Получение записи TapGameProgress по userId
router.get('/:userId', async (req, res) => {
    try {
        const tapGameProgress = await TapGameProgress.findOne({ where: { userId: req.params.userId } });
        if (!tapGameProgress) {
            return res.status(404).json({ message: 'Запись TapGameProgress не найдена' });
        }
        res.json(tapGameProgress);
    } catch (error) {
        res.status(500).json({ message: 'Ошибка при получении записи TapGameProgress', error });
    }
});

// Обновление записи TapGameProgress
router.put('/:userId', async (req, res) => {
    try {
        const tapGameProgress = await TapGameProgress.findOne({ where: { userId: req.params.userId } });
        if (!tapGameProgress) {
            return res.status(404).json({ message: 'Запись TapGameProgress не найдена' });
        }
        const { tapCount, lastTapTime, cooldownEnd, totalTapsPlayed } = req.body;
        tapGameProgress.tapCount = tapCount ?? tapGameProgress.tapCount;
        tapGameProgress.lastTapTime = lastTapTime ?? tapGameProgress.lastTapTime;
        tapGameProgress.cooldownEnd = cooldownEnd ?? tapGameProgress.cooldownEnd;
        tapGameProgress.totalTapsPlayed = totalTapsPlayed ?? tapGameProgress.totalTapsPlayed;
        await tapGameProgress.save();
        res.json(tapGameProgress);
    } catch (error) {
        res.status(500).json({ message: 'Ошибка при обновлении записи TapGameProgress', error });
    }
});

// Удаление записи TapGameProgress
router.delete('/:userId', async (req, res) => {
    try {
        const tapGameProgress = await TapGameProgress.findOne({ where: { userId: req.params.userId } });
        if (!tapGameProgress) {
            return res.status(404).json({ message: 'Запись TapGameProgress не найдена' });
        }
        await tapGameProgress.destroy();
        res.json({ message: 'Запись TapGameProgress удалена' });
    } catch (error) {
        res.status(500).json({ message: 'Ошибка при удалении записи TapGameProgress', error });
    }
});

module.exports = router;
