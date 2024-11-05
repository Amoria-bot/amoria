// models/AmocoinBalance.js

const { DataTypes } = require('sequelize'); // Импорт DataTypes

module.exports = (sequelize) => {
  const AmocoinBalance = sequelize.define('AmocoinBalance', {
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    balance: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0, // Начальный баланс может быть нулевым
    },
  });

  return AmocoinBalance;
};
