'use strict';

module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.bulkInsert('Categories', 
      ['上衣', '褲款', '鞋子', '帽子', '配件']
        .map(category => {
          return {
            name: category,
            created_at: new Date(),
            updated_at: new Date()
          }
        }), {})
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.bulkDelete('Categories', null, {})
  }
};
