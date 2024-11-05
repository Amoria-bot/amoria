// models/TapGameProgress.js
const { DataTypes } = require('sequelize'); // Убедитесь, что DataTypes импортирован

module.exports = (sequelize) => {
  const TapGameProgress = sequelize.define('TapGameProgress', {
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'Users', // указываем таблицу Users
        key: 'id',
      },
    },
    tapCount: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
      allowNull: false,
    },
    lastTapTime: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    cooldownEnd: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    totalTapsPlayed: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
      allowNull: false,
    },
  }, {
    timestamps: true,
  });

  TapGameProgress.associate = (models) => {
    TapGameProgress.belongsTo(models.User, { foreignKey: 'userId' });
  };

  return TapGameProgress;
};
