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
const Message = require('./Message')(sequelize);
const Chat = require('./Chat')(sequelize);
const AmocoinTransaction = require('./AmocoinTransaction')(sequelize);
const AmocoinBalance = require('./AmocoinBalance')(sequelize);
const TapGameProgress = require('./TapGameProgress')(sequelize);
const FortuneWheelProgress = require('./FortuneWheelProgress')(sequelize);
const Character = require('./Character')(sequelize);
const DailyReward = require('./DailyReward')(sequelize); // Подключаем модель DailyReward

// Установка связей между моделями
User.hasMany(Subscription, { foreignKey: 'userId' });
Subscription.belongsTo(User, { foreignKey: 'userId' });

User.hasMany(Transaction, { foreignKey: 'userId' });
Transaction.belongsTo(User, { foreignKey: 'userId' });

User.hasMany(Message, { foreignKey: 'userId' });
Message.belongsTo(User, { foreignKey: 'userId' });

User.hasMany(Chat, { foreignKey: 'userId' });
Chat.belongsTo(User, { foreignKey: 'userId' });

User.hasMany(AmocoinTransaction, { foreignKey: 'userId' });
AmocoinTransaction.belongsTo(User, { foreignKey: 'userId' });

User.hasOne(AmocoinBalance, { foreignKey: 'userId' });
AmocoinBalance.belongsTo(User, { foreignKey: 'userId' });

User.hasOne(TapGameProgress, { foreignKey: 'userId' });
TapGameProgress.belongsTo(User, { foreignKey: 'userId' });

User.hasOne(FortuneWheelProgress, { foreignKey: 'userId' });
FortuneWheelProgress.belongsTo(User, { foreignKey: 'userId' });

User.hasOne(DailyReward, { foreignKey: 'userId' }); // Связь между User и DailyReward
DailyReward.belongsTo(User, { foreignKey: 'userId' }); // Связь между DailyReward и User

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
  Character,
  DailyReward, // Экспортируем модель DailyReward
};
