'use strict'

const faker = require('faker')

module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.bulkInsert('Brands',
      ['GooPi', 'Melsign', 'wlofsd', 'Sense of Place', 'Urban Research']
        .map(brand => {
          return {
            name: brand,
            introduction: faker.lorem.text().substring(0, 120),
            created_at: new Date(),
            updated_at: new Date()
          }
        }), {})
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.bulkDelete('Brands', null, {})
  }
}
