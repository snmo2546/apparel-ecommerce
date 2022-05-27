'use strict'

const faker = require('faker')

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.bulkInsert('Products',
      Array.from({ length: 50 }, () => ({
        name: faker.lorem.word(),
        price: Math.floor(Math.random() * 15000),
        image: `https://loremflickr.com/320/240/apparel/?random=${Math.random() * 100}`,
        description: faker.lorem.text().substring(0, 150),
        created_at: new Date(),
        updated_at: new Date()
      }))
    )
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('Products', null, {})
  }
}
