'use strict';

module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.addColumn('Orders', 'status', {
      type: Sequelize.STRING,
      defaultValue: 'Paid'
    })
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.removeColumn('Orders', 'status')
  }
};
