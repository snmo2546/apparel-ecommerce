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
      PaymentDetail.hasOne(models.Order, { foreignKey: 'paymentDetailId' })
    }
  }
  PaymentDetail.init({
    paymentType: DataTypes.STRING,
    paymentDate: DataTypes.STRING,
    paymentTypeChargeFee: DataTypes.STRING,
    tradeAmt: DataTypes.STRING,
  }, {
    sequelize,
    modelName: 'PaymentDetail',
    tableName: 'Payment_Details',
    underscored: true,
  })
  return PaymentDetail
}