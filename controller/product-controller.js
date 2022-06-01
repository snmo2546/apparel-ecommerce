const { Product, Category, Brand } = require('../models')

const productController = {
  getProducts: (req, res, next) => {
    return Product.findAll({
      raw: true,
      nest: true,
      include: [Category]
    })
      .then(products => res.render('products', { products }))
      .catch(err => next(err))
  },
  getProduct: (req, res, next) => {
    return Product.findByPk(req.params.id, {
      raw: true,
      nest: true,
      include: [Category, Brand]
    })
      .then(product => {
        if (!product) throw new Error("Product doesn't exist!")

        return res.render('product', { product })
      })
      .catch(err => next(err))
  }
}

module.exports = productController
