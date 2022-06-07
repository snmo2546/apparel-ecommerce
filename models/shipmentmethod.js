'use strict'
const {
  Model
} = require('sequelize')
module.exports = (sequelize, DataTypes) => {
  class ShipmentMethod extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      ShipmentMethod.hasMany(models.Order, { foreignKey: 'shipmentMethodId' })
    }
  }
  ShipmentMethod.init({
    name: DataTypes.STRING,
    fee: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'ShipmentMethod',
    tableName: 'Shipment_Methods',
    underscored: true,
  })
  return ShipmentMethod
}