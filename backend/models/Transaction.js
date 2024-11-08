// models/Transaction.js
const { Model, DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  class Transaction extends Model {}

  Transaction.init(
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      userId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: 'Users', // Название таблицы, на которую ссылается внешний ключ
          key: 'id',
        },
        onDelete: 'CASCADE', // При удалении пользователя удалять все его транзакции
      },
      amount: {
        type: DataTypes.FLOAT,
        allowNull: false,
      },
      type: {
        type: DataTypes.ENUM('PURCHASE_AMOCOIN', 'SPEND_AMOCOIN', 'EARN_AMOCOIN', 'REFERRAL_BONUS', 'DAILY_REWARD'),
        allowNull: false,
        comment: 'Типы транзакций: PURCHASE_AMOCOIN, SPEND_AMOCOIN, EARN_AMOCOIN, REFERRAL_BONUS, DAILY_REWARD',
      },
      createdAt: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
      },
      updatedAt: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
      },
    },
    {
      sequelize,
      modelName: 'Transaction',
      tableName: 'Transactions',
      timestamps: true,
    }
  );

  return Transaction;
};
