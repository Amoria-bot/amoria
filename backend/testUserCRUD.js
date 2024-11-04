require('dotenv').config();
const { sequelize, User, Subscription, Transaction, Chat } = require('./models/index'); // Импортируем sequelize и модели из index.js

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

    // 5. Чтение данных пользователя с подпиской, транзакцией и чатом
    const foundUser = await User.findOne({
      where: { telegramId: 123456789 },
      include: [Subscription, Transaction, Chat], // Включаем связанные подписки, транзакции и чаты
    });
    console.log('Найден пользователь с подпиской, транзакцией и чатом:', foundUser ? foundUser.toJSON() : 'Пользователь не найден');

    // 6. Обновление баланса пользователя, статуса подписки, статуса транзакции и сообщения в чате
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
    }

    // 7. Удаление пользователя (вместе с подпиской, транзакцией и чатом, если настроено каскадное удаление)
    if (foundUser) {
      await foundUser.destroy();
      console.log('Пользователь и связанные подписки, транзакции и чаты удалены.');
    }

  } catch (error) {
    console.error('Ошибка в тесте CRUD-операций:', error);
  }
}

testUserSubscriptionTransactionAndChatCRUD();
