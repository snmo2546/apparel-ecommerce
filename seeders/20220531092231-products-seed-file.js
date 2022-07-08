'use strict'

const faker = require('faker')

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const categories = await queryInterface.sequelize.query(
      'SELECT id FROM Categories;',
      { type: queryInterface.sequelize.QueryTypes.SELECT }
    )
    const brands = await queryInterface.sequelize.query(
      'SELECT id FROM Brands;',
      { type: queryInterface.sequelize.QueryTypes.SELECT }
    )
    await queryInterface.bulkInsert('Products',
      Array.from({ length: 50 }, () => ({
        name: faker.lorem.word(),
        price: Math.floor(Math.random() * 100) * 100,
        image: `https://loremflickr.com/320/240/apparel/?random=${Math.floor(Math.random() * 1000)}`,
        description: faker.lorem.text().substring(0, 150),
        created_at: new Date(),
        updated_at: new Date(),
        category_id: categories[Math.floor(Math.random() * categories.length)].id,
        brand_id: brands[Math.floor(Math.random() * brands.length)].id
      }))
    )
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('Products', null, {})
  }
}
