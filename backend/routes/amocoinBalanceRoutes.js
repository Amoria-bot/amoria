// routes/amocoinBalanceRoutes.js
const express = require('express');
const router = express.Router();
const { AmocoinBalance } = require('../models');

/**
 * @swagger
 * tags:
 *   name: AmocoinBalance
 *   description: Операции с балансом Amocoin
 */

/**
 * @swagger
 * /api/amocoin-balance:
 *   post:
 *     summary: Создание баланса пользователя
 *     description: Создает новый баланс для пользователя
 *     tags: [AmocoinBalance]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               userId:
 *                 type: integer
 *               balance:
 *                 type: number
 *     responses:
 *       201:
 *         description: Баланс успешно создан
 *       500:
 *         description: Ошибка при создании баланса
 */
router.post('/', async (req, res) => {
    try {
        const { userId, balance } = req.body;
        const amocoinBalance = await AmocoinBalance.create({ userId, balance });
        res.status(201).json(amocoinBalance);
    } catch (error) {
        res.status(500).json({ message: 'Ошибка при создании баланса', error });
    }
});

/**
 * @swagger
 * /api/amocoin-balance/{userId}:
 *   get:
 *     summary: Получение баланса по userId
 *     description: Возвращает баланс пользователя по указанному ID
 *     tags: [AmocoinBalance]
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID пользователя
 *     responses:
 *       200:
 *         description: Успешный ответ с данными баланса
 *       404:
 *         description: Баланс не найден
 *       500:
 *         description: Ошибка при получении баланса
 */
router.get('/:userId', async (req, res) => {
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

/**
 * @swagger
 * /api/amocoin-balance/{userId}:
 *   put:
 *     summary: Обновление баланса
 *     description: Обновляет баланс пользователя по userId
 *     tags: [AmocoinBalance]
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
 *               balance:
 *                 type: number
 *     responses:
 *       200:
 *         description: Баланс успешно обновлен
 *       404:
 *         description: Баланс не найден
 *       500:
 *         description: Ошибка при обновлении баланса
 */
router.put('/:userId', async (req, res) => {
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

/**
 * @swagger
 * /api/amocoin-balance/{userId}:
 *   delete:
 *     summary: Удаление баланса
 *     description: Удаляет баланс пользователя по userId
 *     tags: [AmocoinBalance]
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID пользователя
 *     responses:
 *       200:
 *         description: Баланс успешно удален
 *       404:
 *         description: Баланс не найден
 *       500:
 *         description: Ошибка при удалении баланса
 */
router.delete('/:userId', async (req, res) => {
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
