// routes/tapGameRoutes.js
const express = require('express');
const router = express.Router();
const { TapGameProgress } = require('../models');

/**
 * @swagger
 * tags:
 *   name: TapGame
 *   description: Операции с игрой Tap
 */
/**
 * @swagger
 * /api/tapgame:
 *   post:
 *     summary: Создание записи TapGameProgress
 *     description: Создает новую запись TapGameProgress для отслеживания прогресса пользователя в Tap Game
 *     tags: [TapGame]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               userId:
 *                 type: integer
 *               tapCount:
 *                 type: integer
 *               lastTapTime:
 *                 type: string
 *                 format: date-time
 *               cooldownEnd:
 *                 type: string
 *                 format: date-time
 *               totalTapsPlayed:
 *                 type: integer
 *     responses:
 *       201:
 *         description: Запись TapGameProgress успешно создана
 *       500:
 *         description: Ошибка при создании записи TapGameProgress
 */
router.post('/', async (req, res) => {
    try {
        const { userId, tapCount, lastTapTime, cooldownEnd, totalTapsPlayed } = req.body;
        const tapGameProgress = await TapGameProgress.create({ userId, tapCount, lastTapTime, cooldownEnd, totalTapsPlayed });
        res.status(201).json(tapGameProgress);
    } catch (error) {
        res.status(500).json({ message: 'Ошибка при создании записи TapGameProgress', error });
    }
});

/**
 * @swagger
 * /api/tapgame/{userId}:
 *   get:
 *     summary: Получение записи TapGameProgress по userId
 *     description: Возвращает запись TapGameProgress для указанного пользователя
 *     tags: [TapGame]
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID пользователя
 *     responses:
 *       200:
 *         description: Успешный ответ с записью TapGameProgress
 *       404:
 *         description: Запись TapGameProgress не найдена
 *       500:
 *         description: Ошибка при получении записи TapGameProgress
 */
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

/**
 * @swagger
 * /api/tapgame/{userId}:
 *   put:
 *     summary: Обновление записи TapGameProgress
 *     description: Обновляет запись TapGameProgress для указанного пользователя
 *     tags: [TapGame]
 *     parameters:
 *       - in: path
 *         name: userId
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
 *               tapCount:
 *                 type: integer
 *               lastTapTime:
 *                 type: string
 *                 format: date-time
 *               cooldownEnd:
 *                 type: string
 *                 format: date-time
 *               totalTapsPlayed:
 *                 type: integer
 *     responses:
 *       200:
 *         description: Запись TapGameProgress успешно обновлена
 *       404:
 *         description: Запись TapGameProgress не найдена
 *       500:
 *         description: Ошибка при обновлении записи TapGameProgress
 */
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

/**
 * @swagger
 * /api/tapgame/{userId}:
 *   delete:
 *     summary: Удаление записи TapGameProgress
 *     description: Удаляет запись TapGameProgress для указанного пользователя
 *     tags: [TapGame]
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID пользователя
 *     responses:
 *       200:
 *         description: Запись TapGameProgress успешно удалена
 *       404:
 *         description: Запись TapGameProgress не найдена
 *       500:
 *         description: Ошибка при удалении записи TapGameProgress
 */
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
