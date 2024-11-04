// models/index.js
require('dotenv').config();
const { Sequelize } = require('sequelize');

// Инициализация Sequelize с подключением к базе данных
const sequelize = new Sequelize(process.env.DATABASE_URL, {
  dialect: 'postgres',
  logging: false,
});

// Импортируем модели как функции и передаем им экземпляр sequelize
const User = require('./User')(sequelize);
const Subscription = require('./Subscription')(sequelize);
const Transaction = require('./Transaction')(sequelize);
const Message = require('./Message')(sequelize); // Подключаем модель Message
const Chat = require('./Chat')(sequelize); // Подключаем модель Chat

// Установка связей между моделями
User.hasMany(Subscription, { foreignKey: 'userId' });
Subscription.belongsTo(User, { foreignKey: 'userId' });

User.hasMany(Transaction, { foreignKey: 'userId' });
Transaction.belongsTo(User, { foreignKey: 'userId' });

User.hasMany(Message, { foreignKey: 'userId' });
Message.belongsTo(User, { foreignKey: 'userId' });

User.hasMany(Chat, { foreignKey: 'userId' }); // Связь между User и Chat
Chat.belongsTo(User, { foreignKey: 'userId' }); // Связь между Chat и User

// Функция для синхронизации базы данных
async function syncDatabase() {
  try {
    await sequelize.authenticate();
    console.log('Соединение с базой данных установлено успешно.');
    
    await sequelize.sync({ alter: true });
    console.log('Синхронизация всех моделей завершена.');
  } catch (error) {
    console.error('Ошибка при синхронизации базы данных:', error);
  }
}

syncDatabase();

module.exports = { sequelize, User, Subscription, Transaction, Message, Chat };
