'use strict'
const {
  Model
} = require('sequelize')
module.exports = (sequelize, DataTypes) => {
  class PaymentDetail extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      PaymentDetail.belongsTo(models.Order, { foreignKey: 'orderId' })
    }
  }
  PaymentDetail.init({
    cardNumber: DataTypes.STRING,
    cardHolder: DataTypes.STRING,
    expirationDate: DataTypes.STRING,
    securityCode: DataTypes.STRING,
    orderId: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'PaymentDetail',
    tableName: 'Payment_Details',
    underscored: true,
  })
  return PaymentDetail
}