// models/AmocoinTransaction.js
const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const AmocoinTransaction = sequelize.define('AmocoinTransaction', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    amount: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    type: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    source: {
      type: DataTypes.STRING,
      allowNull: true, // Указывает источник транзакции, например, игра, активность и т.д.
    },
    status: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: 'completed',
    },
  }, {
    timestamps: true,
  });

  return AmocoinTransaction;
};
