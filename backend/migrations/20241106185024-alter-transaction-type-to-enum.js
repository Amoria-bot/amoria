'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    // Создаем тип ENUM, если он не существует
    await queryInterface.sequelize.query(`
      DO $$ BEGIN
        IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'enum_transactions_type') THEN
          CREATE TYPE "enum_transactions_type" AS ENUM ('PURCHASE_AMOCOIN', 'SPEND_AMOCOIN', 'EARN_AMOCOIN', 'REFERRAL_BONUS', 'DAILY_REWARD');
        END IF;
      END $$;
    `);

    // Создаем временную колонку с новым типом ENUM
    await queryInterface.addColumn('Transactions', 'type_temp', {
      type: 'enum_transactions_type',
      allowNull: false,
      defaultValue: 'PURCHASE_AMOCOIN', // временное значение
      comment: 'Типы транзакций: PURCHASE_AMOCOIN, SPEND_AMOCOIN, EARN_AMOCOIN, REFERRAL_BONUS, DAILY_REWARD',
    });

    // Копируем данные из старой колонки в новую колонку
    await queryInterface.sequelize.query(`
      UPDATE "Transactions" SET "type_temp" = CASE 
        WHEN "type" = 'PURCHASE_AMOCOIN' THEN 'PURCHASE_AMOCOIN'::enum_transactions_type
        WHEN "type" = 'SPEND_AMOCOIN' THEN 'SPEND_AMOCOIN'::enum_transactions_type
        WHEN "type" = 'EARN_AMOCOIN' THEN 'EARN_AMOCOIN'::enum_transactions_type
        WHEN "type" = 'REFERRAL_BONUS' THEN 'REFERRAL_BONUS'::enum_transactions_type
        WHEN "type" = 'DAILY_REWARD' THEN 'DAILY_REWARD'::enum_transactions_type
        ELSE 'PURCHASE_AMOCOIN'::enum_transactions_type
      END;
    `);

    // Удаляем старую колонку и переименовываем временную колонку в основную
    await queryInterface.removeColumn('Transactions', 'type');
    await queryInterface.renameColumn('Transactions', 'type_temp', 'type');
  },

  async down(queryInterface, Sequelize) {
    // Возвращаем колонку к строке, если нужно откатить миграцию
    await queryInterface.addColumn('Transactions', 'type_temp', {
      type: Sequelize.STRING,
      allowNull: false,
    });

    await queryInterface.sequelize.query(`
      UPDATE "Transactions" SET "type_temp" = "type"::text;
    `);

    await queryInterface.removeColumn('Transactions', 'type');
    await queryInterface.renameColumn('Transactions', 'type_temp', 'type');

    // Удаляем тип ENUM, если он существует
    await queryInterface.sequelize.query(`DROP TYPE IF EXISTS "enum_transactions_type";`);
  },
};
