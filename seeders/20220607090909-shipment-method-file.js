'use strict'

module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.bulkInsert('Shipment_Methods', [{
      name: '超商取貨',
      fee: 60,
      created_at: new Date(),
      updated_at: new Date()
    }, {
      name: '宅配',
      fee: 120,
      created_at: new Date(),
      updated_at: new Date()
    }], {})
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.bulkDelete('Shipment_Methods', null, {})
  }
}
