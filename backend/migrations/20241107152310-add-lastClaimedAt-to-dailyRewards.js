'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn('DailyRewards', 'lastClaimedAt', {
      type: Sequelize.DATE,
      allowNull: true,
      comment: 'Дата последнего получения ежедневной награды',
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeColumn('DailyRewards', 'lastClaimedAt');
  },
};
