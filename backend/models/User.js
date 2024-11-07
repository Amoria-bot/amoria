// models/User.js
const { Model, DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  class User extends Model {
    static associate(models) {
      User.hasOne(models.Subscription, {
        foreignKey: 'userId',
        as: 'subscription',
      });
      User.hasOne(models.DailyReward, {
        foreignKey: 'userId',
        as: 'dailyReward',
      });
    }
  }

  User.init(
    {
      telegramId: {
        type: DataTypes.BIGINT,
        unique: true,
        allowNull: false,
      },
      balance: {
        type: DataTypes.INTEGER,
        defaultValue: 0,
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
      modelName: 'User',
      tableName: 'Users',
      timestamps: true,
    }
  );

  return User;
};
