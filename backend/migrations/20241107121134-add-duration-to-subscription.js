'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn('Subscriptions', 'duration', {
      type: Sequelize.ENUM('1_month', '1_year'),
      allowNull: false,
      defaultValue: '1_month',
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeColumn('Subscriptions', 'duration');
    await queryInterface.sequelize.query('DROP TYPE IF EXISTS "enum_Subscriptions_duration";');
  },
};
