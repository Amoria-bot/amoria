// models/Subscription.js
const { Model, DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  class Subscription extends Model {
    static associate(models) {
      Subscription.belongsTo(models.User, {
        foreignKey: 'userId',
        as: 'user', // Используем 'user' как алиас, если к Subscription требуется подключать user
      });
    }
  }

  Subscription.init(
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
          model: 'Users', // Название таблицы User
          key: 'id',
        },
        onDelete: 'CASCADE',
      },
      status: {
        type: DataTypes.STRING,
        allowNull: false,
        defaultValue: 'inactive', // активная или неактивная подписка
      },
      duration: {
        type: DataTypes.ENUM('1_month', '1_year'),
        allowNull: true,
        comment: 'Длительность подписки: 1 месяц или 1 год',
      },
      expiresOn: {
        type: DataTypes.DATE,
        allowNull: true,
        comment: 'Дата истечения подписки',
      },
      createdAt: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW,
      },
      updatedAt: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW,
      },
    },
    {
      sequelize,
      modelName: 'Subscription',
      tableName: 'Subscriptions',
      timestamps: true,
    }
  );

  return Subscription;
};
