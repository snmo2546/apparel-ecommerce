'use strict'

const bcrypt = require('bcryptjs')

module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.bulkInsert('Users', [{
      email: 'root@example.com',
      password: await bcrypt.hash('12345678', 10),
      role: 'admin',
      name: 'Admin',
      created_at: new Date(),
      updated_at: new Date()
    }, {
      email: 'user1@example.com',
      password: await bcrypt.hash('123', 10),
      role: null,
      name: 'user1',
      created_at: new Date(),
      updated_at: new Date()
    }, {
      email: 'user2@example.com',
      password: await bcrypt.hash('123', 10),
      role: null,
      name: 'user2',
      created_at: new Date(),
      updated_at: new Date()
    }, {
      email: 'user3@example.com',
      password: await bcrypt.hash('123', 10),
      role: null,
      name: 'user3',
      created_at: new Date(),
      updated_at: new Date()      
    }], {})
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.bulkDelete('Users', null, {})
  }
}
