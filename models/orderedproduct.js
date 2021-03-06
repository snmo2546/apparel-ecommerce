'use strict'
const {
  Model
} = require('sequelize')
module.exports = (sequelize, DataTypes) => {
  class OrderedProduct extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      OrderedProduct.belongsTo(models.Order, { foreignKey: 'orderId' })
      OrderedProduct.belongsTo(models.Product, { foreignKey: 'productId' })
    }
  }
  OrderedProduct.init({
    quantity: DataTypes.INTEGER,
    amount: DataTypes.INTEGER,
    orderId: DataTypes.INTEGER,
    productId: DataTypes.INTEGER,
    color: DataTypes.STRING,
    size: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'OrderedProduct',
    tableName: 'Ordered_Products',
    underscored: true,
  })
  return OrderedProduct
}