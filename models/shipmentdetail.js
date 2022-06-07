'use strict'
const {
  Model
} = require('sequelize')
module.exports = (sequelize, DataTypes) => {
  class ShipmentDetail extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      ShipmentDetail.belongsTo(models.User, { foreignKey: 'userId' })
      ShipmentDetail.hasMany(models.Order, { foreignKey: 'shipmentDetailId' })
    }
  }
  ShipmentDetail.init({
    name: DataTypes.STRING,
    address: DataTypes.STRING,
    phone: DataTypes.STRING,
    email: DataTypes.STRING,
    userId: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'ShipmentDetail',
    tableName: 'Shipment_Details',
    underscored: true,
  })
  return ShipmentDetail
}