// routes/dailyRewardRoutes.js

const express = require('express');
const router = express.Router();
const { DailyReward, AmocoinBalance } = require('../models'); // Импортируем модели
const { Op } = require('sequelize');

/**
 * @swagger
 * tags:
 *   name: DailyReward
 *   description: Ежедневные награды для пользователей
 */

/**
 * @swagger
 * /api/daily-reward/{userId}:
 *   post:
 *     summary: Получение ежедневной награды пользователем
 *     description: Обрабатывает получение награды, обновляет стрик и баланс
 *     tags: [DailyReward]
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID пользователя
 *     responses:
 *       200:
 *         description: Награда успешно получена
 *       404:
 *         description: Пользователь не найден
 *       500:
 *         description: Ошибка сервера
 */
router.post('/:userId', async (req, res) => {  // Обратите внимание на корректный путь
  try {
    const userId = req.params.userId;
    const today = new Date();
    let dailyReward = await DailyReward.findOne({ where: { userId } });

    if (!dailyReward) {
      dailyReward = await DailyReward.create({
        userId,
        lastClaimedAt: today,
        streak: 1,
      });
    } else {
      const lastClaimed = new Date(dailyReward.lastClaimedAt);
      const timeDiff = today.getTime() - lastClaimed.getTime();
      const dayDiff = timeDiff / (1000 * 3600 * 24);

      // Проверка streak на случай NaN или null
      if (isNaN(dailyReward.streak) || dailyReward.streak === null) {
        dailyReward.streak = 1;
      }

      if (dayDiff >= 1) {
        if (dayDiff < 2) {
          dailyReward.streak += 1;
        } else {
          dailyReward.streak = 1;
        }
        dailyReward.lastClaimedAt = today;
        await dailyReward.save();
      } else {
        return res.status(400).json({ message: 'Награда уже получена сегодня' });
      }
    }

    const rewardAmount = Math.min(dailyReward.streak * 10, 100);

    // Обновляем или создаем запись в AmocoinBalance
    let amocoinBalance = await AmocoinBalance.findOne({ where: { userId } });
    if (!amocoinBalance) {
      amocoinBalance = await AmocoinBalance.create({
        userId,
        balance: rewardAmount,
      });
    } else {
      amocoinBalance.balance += rewardAmount;
      await amocoinBalance.save();
    }

    res.json({ message: 'Награда успешно получена', rewardAmount, streak: dailyReward.streak, balance: amocoinBalance.balance });
  } catch (error) {
    console.error('Ошибка при получении ежедневной награды:', error.message || error);
    res.status(500).json({ message: 'Ошибка сервера', error: error.message || error });
  }
});

module.exports = router;
