// routes/transactionRoutes.js
const express = require('express');
const router = express.Router();
const { Transaction, User } = require('../models'); // Импортируем обе модели

/**
 * @swagger
 * tags:
 *   name: Transactions
 *   description: Операции с транзакциями
 */

/**
 * @swagger
 * /api/transactions:
 *   post:
 *     summary: Создание новой транзакции
 *     description: Создает новую транзакцию на основе переданных данных
 *     tags: [Transactions]
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
 *                 enum: [PURCHASE_AMOCOIN, SPEND_AMOCOIN, EARN_AMOCOIN, REFERRAL_BONUS, DAILY_REWARD]
 *                 description: Тип транзакции
 *     responses:
 *       201:
 *         description: Транзакция успешно создана
 *       400:
 *         description: Ошибка при создании транзакции
 */
router.post('/', async (req, res) => {
  try {
    const { userId, amount, type } = req.body;

    // Создаем транзакцию
    const newTransaction = await Transaction.create({ userId, amount, type });

    // Находим пользователя
    const user = await User.findByPk(userId);

    if (!user) {
      return res.status(404).json({ message: 'Пользователь не найден' });
    }

    // Обновляем баланс пользователя в зависимости от типа транзакции
    if (type === 'SPEND_AMOCOIN') {
      user.balance -= amount; // Списание
    } else {
      user.balance += amount; // Пополнение
    }

    // Сохраняем обновление баланса
    await user.save();

    res.status(201).json(newTransaction);
  } catch (error) {
    console.error('Ошибка при создании транзакции:', error);
    res.status(400).json({ message: 'Ошибка при создании транзакции', error });
  }
});

/**
 * @swagger
 * /api/transactions/{id}:
 *   get:
 *     summary: Получение транзакции по ID
 *     description: Возвращает данные транзакции по указанному ID
 *     tags: [Transactions]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID транзакции
 *     responses:
 *       200:
 *         description: Успешный ответ с данными транзакции
 *       404:
 *         description: Транзакция не найдена
 *       500:
 *         description: Ошибка сервера
 */
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

/**
 * @swagger
 * /api/transactions/{id}:
 *   put:
 *     summary: Обновление транзакции по ID
 *     description: Обновляет данные транзакции по указанному ID
 *     tags: [Transactions]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID транзакции
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
 *                 enum: [PURCHASE_AMOCOIN, SPEND_AMOCOIN, EARN_AMOCOIN, REFERRAL_BONUS, DAILY_REWARD]
 *                 description: Тип транзакции
 *     responses:
 *       200:
 *         description: Данные транзакции успешно обновлены
 *       404:
 *         description: Транзакция не найдена
 *       500:
 *         description: Ошибка сервера
 */
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

/**
 * @swagger
 * /api/transactions/{id}:
 *   delete:
 *     summary: Удаление транзакции по ID
 *     description: Удаляет транзакцию по указанному ID
 *     tags: [Transactions]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID транзакции
 *     responses:
 *       200:
 *         description: Транзакция успешно удалена
 *       404:
 *         description: Транзакция не найдена
 *       500:
 *         description: Ошибка сервера
 */
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
