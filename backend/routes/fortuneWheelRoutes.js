// routes/fortuneWheelRoutes.js
const express = require('express');
const router = express.Router();
const { FortuneWheelProgress } = require('../models');

/**
 * @swagger
 * tags:
 *   name: FortuneWheel
 *   description: Операции с колесом фортуны
 */
/**
 * @swagger
 * /api/fortune-wheel:
 *   post:
 *     summary: Создание записи FortuneWheelProgress
 *     description: Создает новую запись FortuneWheelProgress для отслеживания прогресса пользователя в Колесе Фортуны
 *     tags: [FortuneWheel]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               userId:
 *                 type: integer
 *               spinCount:
 *                 type: integer
 *               lastSpinTime:
 *                 type: string
 *                 format: date-time
 *     responses:
 *       201:
 *         description: Запись FortuneWheelProgress успешно создана
 *       500:
 *         description: Ошибка при создании записи FortuneWheelProgress
 */
router.post('/', async (req, res) => {
    try {
        const { userId, spinCount, lastSpinTime } = req.body;
        const fortuneWheelProgress = await FortuneWheelProgress.create({ userId, spinCount, lastSpinTime });
        res.status(201).json(fortuneWheelProgress);
    } catch (error) {
        res.status(500).json({ message: 'Ошибка при создании записи FortuneWheelProgress', error });
    }
});

/**
 * @swagger
 * /api/fortune-wheel/{userId}:
 *   get:
 *     summary: Получение записи FortuneWheelProgress по userId
 *     description: Возвращает запись FortuneWheelProgress для указанного пользователя
 *     tags: [FortuneWheel]
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID пользователя
 *     responses:
 *       200:
 *         description: Успешный ответ с записью FortuneWheelProgress
 *       404:
 *         description: Запись FortuneWheelProgress не найдена
 *       500:
 *         description: Ошибка при получении записи FortuneWheelProgress
 */
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

/**
 * @swagger
 * /api/fortune-wheel/{userId}:
 *   put:
 *     summary: Обновление записи FortuneWheelProgress
 *     description: Обновляет запись FortuneWheelProgress для указанного пользователя
 *     tags: [FortuneWheel]
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
 *               spinCount:
 *                 type: integer
 *               lastSpinTime:
 *                 type: string
 *                 format: date-time
 *     responses:
 *       200:
 *         description: Запись FortuneWheelProgress успешно обновлена
 *       404:
 *         description: Запись FortuneWheelProgress не найдена
 *       500:
 *         description: Ошибка при обновлении записи FortuneWheelProgress
 */
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

/**
 * @swagger
 * /api/fortune-wheel/{userId}:
 *   delete:
 *     summary: Удаление записи FortuneWheelProgress
 *     description: Удаляет запись FortuneWheelProgress для указанного пользователя
 *     tags: [FortuneWheel]
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID пользователя
 *     responses:
 *       200:
 *         description: Запись FortuneWheelProgress успешно удалена
 *       404:
 *         description: Запись FortuneWheelProgress не найдена
 *       500:
 *         description: Ошибка при удалении записи FortuneWheelProgress
 */
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
