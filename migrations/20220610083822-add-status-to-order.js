'use strict';

module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.addColumn('Orders', 'payment_status', {
      type: Sequelize.STRING,
      defaultValue: '0'
    })
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.removeColumn('Orders', 'payment_status')
  }
};
