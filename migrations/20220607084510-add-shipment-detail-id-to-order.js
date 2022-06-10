'use strict'

module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.addColumn('Orders', 'shipment_detail_id', {
      type: Sequelize.INTEGER,
      references: {
        model: 'Shipment_Details',
        key: 'id'
      }
    })
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.removeColumn('Orders', 'shipment_detail_id')
  }
}
