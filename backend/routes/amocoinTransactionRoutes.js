// routes/amocoinTransactionRoutes.js
const express = require('express');
const router = express.Router();
const { AmocoinTransaction } = require('../models');

/**
 * @swagger
 * tags:
 *   name: AmocoinTransactions
 *   description: Операции с транзакциями Amocoin
 */
/**
 * @swagger
 * /api/amocoin-transaction:
 *   post:
 *     summary: Создание транзакции Amocoin
 *     description: Создает новую транзакцию Amocoin
 *     tags: [AmocoinTransactions]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               userId:
 *                 type: integer
 *               amount:
 *                 type: number
 *               type:
 *                 type: string
 *               source:
 *                 type: string
 *               status:
 *                 type: string
 *     responses:
 *       201:
 *         description: Транзакция Amocoin успешно создана
 *       500:
 *         description: Ошибка при создании транзакции Amocoin
 */
router.post('/amocoin-transaction', async (req, res) => {
    try {
        const { userId, amount, type, source, status } = req.body;
        const amocoinTransaction = await AmocoinTransaction.create({ userId, amount, type, source, status });
        res.status(201).json(amocoinTransaction);
    } catch (error) {
        res.status(500).json({ message: 'Ошибка при создании транзакции Amocoin', error });
    }
});

/**
 * @swagger
 * /api/amocoin-transaction/{id}:
 *   get:
 *     summary: Получение транзакции Amocoin по ID
 *     description: Возвращает транзакцию Amocoin по указанному ID
 *     tags: [AmocoinTransactions]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID транзакции Amocoin
 *     responses:
 *       200:
 *         description: Успешный ответ с данными транзакции Amocoin
 *       404:
 *         description: Транзакция Amocoin не найдена
 *       500:
 *         description: Ошибка при получении транзакции Amocoin
 */
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

/**
 * @swagger
 * /api/amocoin-transaction/user/{userId}:
 *   get:
 *     summary: Получение всех транзакций Amocoin для пользователя
 *     description: Возвращает все транзакции Amocoin для указанного пользователя
 *     tags: [AmocoinTransactions]
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID пользователя
 *     responses:
 *       200:
 *         description: Успешный ответ с данными транзакций Amocoin
 *       404:
 *         description: Транзакции Amocoin для пользователя не найдены
 *       500:
 *         description: Ошибка при получении транзакций Amocoin для пользователя
 */
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

/**
 * @swagger
 * /api/amocoin-transaction/{id}:
 *   put:
 *     summary: Обновление транзакции Amocoin
 *     description: Обновляет данные транзакции Amocoin по ID
 *     tags: [AmocoinTransactions]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID транзакции Amocoin
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               amount:
 *                 type: number
 *               type:
 *                 type: string
 *               source:
 *                 type: string
 *               status:
 *                 type: string
 *     responses:
 *       200:
 *         description: Транзакция Amocoin успешно обновлена
 *       404:
 *         description: Транзакция Amocoin не найдена
 *       500:
 *         description: Ошибка при обновлении транзакции Amocoin
 */
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

/**
 * @swagger
 * /api/amocoin-transaction/{id}:
 *   delete:
 *     summary: Удаление транзакции Amocoin
 *     description: Удаляет транзакцию Amocoin по ID
 *     tags: [AmocoinTransactions]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID транзакции Amocoin
 *     responses:
 *       200:
 *         description: Транзакция Amocoin успешно удалена
 *       404:
 *         description: Транзакция Amocoin не найдена
 *       500:
 *         description: Ошибка при удалении транзакции Amocoin
 */
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
