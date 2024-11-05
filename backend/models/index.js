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
const AmocoinTransaction = require('./AmocoinTransaction')(sequelize); // Подключаем модель AmocoinTransaction
const AmocoinBalance = require('./AmocoinBalance')(sequelize); // Подключаем модель AmocoinBalance
const TapGameProgress = require('./TapGameProgress')(sequelize); // Подключаем модель TapGameProgress
const FortuneWheelProgress = require('./FortuneWheelProgress')(sequelize); // Подключаем модель FortuneWheelProgress

// Установка связей между моделями
User.hasMany(Subscription, { foreignKey: 'userId' });
Subscription.belongsTo(User, { foreignKey: 'userId' });

User.hasMany(Transaction, { foreignKey: 'userId' });
Transaction.belongsTo(User, { foreignKey: 'userId' });

User.hasMany(Message, { foreignKey: 'userId' });
Message.belongsTo(User, { foreignKey: 'userId' });

User.hasMany(Chat, { foreignKey: 'userId' }); // Связь между User и Chat
Chat.belongsTo(User, { foreignKey: 'userId' }); // Связь между Chat и User

User.hasMany(AmocoinTransaction, { foreignKey: 'userId' }); // Связь между User и AmocoinTransaction
AmocoinTransaction.belongsTo(User, { foreignKey: 'userId' }); // Связь между AmocoinTransaction и User

User.hasOne(AmocoinBalance, { foreignKey: 'userId' }); // Связь между User и AmocoinBalance
AmocoinBalance.belongsTo(User, { foreignKey: 'userId' }); // Связь между AmocoinBalance и User

User.hasOne(TapGameProgress, { foreignKey: 'userId' }); // Связь между User и TapGameProgress
TapGameProgress.belongsTo(User, { foreignKey: 'userId' }); // Связь между TapGameProgress и User

User.hasOne(FortuneWheelProgress, { foreignKey: 'userId' }); // Связь между User и FortuneWheelProgress
FortuneWheelProgress.belongsTo(User, { foreignKey: 'userId' }); // Связь между FortuneWheelProgress и User

// Экспортируем экземпляр Sequelize и модели
module.exports = {
  sequelize,
  User,
  Subscription,
  Transaction,
  Message,
  Chat,
  AmocoinTransaction,
  AmocoinBalance,
  TapGameProgress,
  FortuneWheelProgress,
};
