// models/Chat.js
const { Model, DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  class Chat extends Model {}

  Chat.init({
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'Users',
        key: 'id',
      },
      onDelete: 'CASCADE',
    },
    characterId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      comment: 'ID персонажа, с которым пользователь ведет чат',
    },
    lastMessage: {
      type: DataTypes.STRING,
      allowNull: true,
      comment: 'Последнее сообщение в чате',
    },
    createdAt: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
    updatedAt: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
  }, {
    sequelize,
    modelName: 'Chat',
    tableName: 'Chats',
    timestamps: true,
  });

  return Chat;
};
