// models/FortuneWheelProgress.js
const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
    const FortuneWheelProgress = sequelize.define('FortuneWheelProgress', {
        userId: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: 'Users',
                key: 'id',
            },
        },
        spinCount: {
            type: DataTypes.INTEGER,
            defaultValue: 0,
            allowNull: false,
        },
        lastSpinTime: {
            type: DataTypes.DATE,
            allowNull: true,
        },
    }, {
        timestamps: true,
    });

    FortuneWheelProgress.associate = (models) => {
        FortuneWheelProgress.belongsTo(models.User, { foreignKey: 'userId' });
    };

    return FortuneWheelProgress;
};
