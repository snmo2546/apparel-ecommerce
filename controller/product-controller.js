const { Product, Category } = require('../models')

const productController = {
  getProducts: (req, res, next) => {
    return Product.findAll({
      raw: true,
      nest: true,
      include: [Category]
    })
      .then(products => res.render('products', { products }))
      .catch(err => next(err))
  }
}

module.exports = productController
