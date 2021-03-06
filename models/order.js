'use strict'
const {
  Model
} = require('sequelize')
module.exports = (sequelize, DataTypes) => {
  class Order extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      Order.belongsTo(models.User, { foreignKey: 'userId' })
      Order.hasMany(models.OrderedProduct, { foreignKey: 'orderId' })
      Order.belongsTo(models.ShipmentMethod, { foreignKey: 'shipmentMethodId' })
      Order.belongsTo(models.ShipmentDetail, { foreignKey: 'shipmentDetailId' })
      Order.belongsTo(models.PaymentDetail, { foreignKey: 'paymentDetailId' })
      Order.hasMany(models.Message, { foreignKey: 'orderId' })
    }
  }
  Order.init({
    total: DataTypes.INTEGER,
    userId: DataTypes.INTEGER,
    shipmentMethodId: DataTypes.INTEGER,
    paymentDetailId: DataTypes.INTEGER,
    paymentStatus: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'Order',
    tableName: 'Orders',
    underscored: true,
  })
  return Order
}