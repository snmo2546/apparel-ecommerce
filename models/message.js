'use strict'
const {
  Model
} = require('sequelize')
module.exports = (sequelize, DataTypes) => {
  class Message extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      Message.belongsTo(models.Order, { foreignKey: 'orderId' })
      Message.belongsTo(models.User, { foreignKey: 'userId' })
    }
  }
  Message.init({
    text: DataTypes.STRING,
    userId: DataTypes.INTEGER,
    orderId: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'Message',
    tableName: 'Messages',
    underscored: true
  })
  return Message
}