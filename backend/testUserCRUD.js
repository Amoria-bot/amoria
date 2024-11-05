require('dotenv').config();
const { sequelize, User, Subscription, Transaction, Chat, AmocoinTransaction, AmocoinBalance, TapGameProgress, FortuneWheelProgress } = require('./models/index'); // Импортируем sequelize и модели из index.js

async function testUserSubscriptionTransactionAndChatCRUD() {
  try {
    // Удаляем пользователя с этим telegramId, если он уже существует
    await User.destroy({ where: { telegramId: 123456789 } });

    // 1. Создание пользователя
    const newUser = await User.create({
      telegramId: 123456789, // фиктивный telegramId
      balance: 100,
    });
    console.log('Создан новый пользователь:', newUser.toJSON());

    // 2. Создание подписки для пользователя
    const newSubscription = await Subscription.create({
      userId: newUser.id,
      status: 'active',
      expiresOn: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // подписка на 7 дней
    });
    console.log('Создана новая подписка:', newSubscription.toJSON());

    // 3. Создание транзакции для пользователя
    const newTransaction = await Transaction.create({
      userId: newUser.id,
      type: 'purchase',
      amount: 50,
      status: 'completed',
    });
    console.log('Создана новая транзакция:', newTransaction.toJSON());

    // 4. Создание чата для пользователя
    const newChat = await Chat.create({
      userId: newUser.id,
      characterId: 1, // фиктивный characterId, измените на актуальный ID
      message: 'Привет от персонажа!',
    });
    console.log('Создан новый чат:', newChat.toJSON());

    // 5. Создание баланса амокоинов для пользователя
    const newAmocoinBalance = await AmocoinBalance.create({
      userId: newUser.id,
      balance: 0, // начальный баланс
    });
    console.log('Создан начальный баланс амокоинов для пользователя:', newAmocoinBalance.toJSON());

    // 6. Создание транзакции амокоинов для пользователя
    const newAmocoinTransaction = await AmocoinTransaction.create({
      userId: newUser.id,
      amount: 20,
      type: 'activity',
      source: 'daily_login',
    });
    console.log('Создана новая транзакция амокоинов:', newAmocoinTransaction.toJSON());

    // 7. Создание прогресса для TapGame для пользователя
    const newTapGameProgress = await TapGameProgress.create({
      userId: newUser.id,
      tapCount: 0,
      lastTapTime: new Date(),
      cooldownEnd: new Date(Date.now() + 1000 * 60 * 10), // пример, через 10 минут
      totalTapsPlayed: 0,
    });
    console.log('Создан прогресс игры TapGame для пользователя:', newTapGameProgress.toJSON());

    // 8. Создание прогресса для FortuneWheel для пользователя
    const newFortuneWheelProgress = await FortuneWheelProgress.create({
      userId: newUser.id,
      lastSpinTime: new Date(),
      totalSpins: 0,
    });
    console.log('Создан прогресс игры FortuneWheel для пользователя:', newFortuneWheelProgress.toJSON());

    // 9. Чтение данных пользователя с подпиской, транзакцией, чатом, балансом, транзакцией амокоинов, прогрессом TapGame и FortuneWheel
    const foundUser = await User.findOne({
      where: { telegramId: 123456789 },
      include: [Subscription, Transaction, Chat, AmocoinTransaction, AmocoinBalance, TapGameProgress, FortuneWheelProgress],
    });
    console.log('Найден пользователь с полной информацией:', foundUser ? foundUser.toJSON() : 'Пользователь не найден');

    // 10. Обновление данных пользователя и связанных записей
    if (foundUser) {
      foundUser.balance += 50;
      await foundUser.save();
      console.log('Обновленный пользователь:', foundUser.toJSON());

      // Обновляем статус подписки
      if (foundUser.Subscriptions && foundUser.Subscriptions.length > 0) {
        const subscription = foundUser.Subscriptions[0];
        subscription.status = 'expired';
        await subscription.save();
        console.log('Обновленная подписка:', subscription.toJSON());
      }

      // Обновляем статус транзакции
      if (foundUser.Transactions && foundUser.Transactions.length > 0) {
        const transaction = foundUser.Transactions[0];
        transaction.status = 'refunded';
        await transaction.save();
        console.log('Обновленная транзакция:', transaction.toJSON());
      }

      // Обновляем сообщение в чате
      if (foundUser.Chats && foundUser.Chats.length > 0) {
        const chat = foundUser.Chats[0];
        chat.message = 'Обновленное сообщение от персонажа';
        await chat.save();
        console.log('Обновленный чат:', chat.toJSON());
      }

      // Обновляем баланс амокоинов
      if (foundUser.AmocoinBalance) {
        foundUser.AmocoinBalance.balance += 30;
        await foundUser.AmocoinBalance.save();
        console.log('Обновленный баланс амокоинов:', foundUser.AmocoinBalance.toJSON());
      }

      // Обновляем транзакцию амокоинов
      if (foundUser.AmocoinTransactions && foundUser.AmocoinTransactions.length > 0) {
        const amocoinTransaction = foundUser.AmocoinTransactions[0];
        amocoinTransaction.amount += 10;
        await amocoinTransaction.save();
        console.log('Обновленная транзакция амокоинов:', amocoinTransaction.toJSON());
      }

      // Обновляем прогресс TapGame
      if (foundUser.TapGameProgress) {
        foundUser.TapGameProgress.tapCount += 5;
        foundUser.TapGameProgress.totalTapsPlayed += 5;
        foundUser.TapGameProgress.lastTapTime = new Date();
        await foundUser.TapGameProgress.save();
        console.log('Обновленный прогресс TapGame:', foundUser.TapGameProgress.toJSON());
      }

      // Обновляем прогресс FortuneWheel
      if (foundUser.FortuneWheelProgress) {
        foundUser.FortuneWheelProgress.totalSpins += 1;
        foundUser.FortuneWheelProgress.lastSpinTime = new Date();
        await foundUser.FortuneWheelProgress.save();
        console.log('Обновленный прогресс FortuneWheel:', foundUser.FortuneWheelProgress.toJSON());
      }
    }

    // 11. Удаление пользователя и всех связанных записей
    if (foundUser) {
      await foundUser.destroy();
      console.log('Пользователь и все связанные записи удалены.');
    }

  } catch (error) {
    console.error('Ошибка в тесте CRUD-операций:', error);
  }
}

testUserSubscriptionTransactionAndChatCRUD();
