// models/DailyReward.js
const { Model, DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  class DailyReward extends Model {}

  DailyReward.init(
    {
      userId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: 'Users',
          key: 'id',
        },
        onDelete: 'CASCADE',
      },
      lastClaimedAt: {
        type: DataTypes.DATE,
        allowNull: true,
        comment: 'Дата последнего получения ежедневной награды',
      },
      streakCount: {
        type: DataTypes.INTEGER,
        defaultValue: 0,
        comment: 'Текущая серия входов пользователя',
      },
    },
    {
      sequelize,
      modelName: 'DailyReward',
      tableName: 'DailyRewards',
      timestamps: true,
    }
  );

  return DailyReward;
};
