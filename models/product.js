'use strict'
const {
  Model
} = require('sequelize')
module.exports = (sequelize, DataTypes) => {
  class Product extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      Product.hasMany(models.OrderedProduct, { foreignKey: 'productId' })
      Product.hasMany(models.CartItem, { foreignKey: 'productId' })
      Product.hasMany(models.Favorite, { foreignKey: 'productId' })
      Product.belongsTo(models.Category, { foreignKey: 'categoryId' })
      Product.belongsTo(models.Brand, { foreignKey: 'brandId' })
      Product.hasMany(models.Stock, { foreignKey: 'productId' })
    }
  }
  Product.init({
    name: DataTypes.STRING,
    price: DataTypes.INTEGER,
    image: DataTypes.STRING,
    description: DataTypes.TEXT,
    categoryId: DataTypes.INTEGER,
    brandId: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'Product',
    tableName: 'Products',
    underscored: true,
  })
  return Product
}