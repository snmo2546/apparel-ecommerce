'use strict'

module.exports = {
  async up (queryInterface, Sequelize) {
    const sizes = ['S', 'M', 'L', 'XL', 'Free']
    const products = await queryInterface.sequelize.query(
      'SELECT id FROM Products;',
      { type: queryInterface.sequelize.QueryTypes.SELECT }
    )
    await queryInterface.bulkInsert('Stocks',
      Array.from({ length: products.length }, (v, i) => ({
        product_id: products[i].id,
        size: sizes[Math.floor(Math.random() * sizes.length)],
        quantity: Math.floor(Math.random() * 50) + 1,
        created_at: new Date(),
        updated_at: new Date()
      }))
    )
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.bulkDelete('Stocks', null, {})
  }
}
