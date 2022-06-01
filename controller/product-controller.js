const { Product, Category, Brand } = require('../models')

const productController = {
  getIndex: (req, res, next) => {
    return Promise.all([
      Product.findAll({
        raw: true,
        nest: true,
        order: [['createdAt', 'DESC']]
      }),
      Category.findAll({ raw: true }),
      Brand.findAll({ raw: true })
    ])   
      .then(([products, categories, brands]) => res.render('index', { products, categories, brands }))
      .catch(err => next(err))
  },
  getProduct: (req, res, next) => {
    return Promise.all([
      Product.findByPk(req.params.id, {
        raw: true,
        nest: true,
        include: [Category, Brand]
      }),
      Category.findAll({ raw: true }),
      Brand.findAll({ raw: true })      
    ])
      .then(([product, categories, brands]) => {
        if (!product) throw new Error("Product doesn't exist!")

        return res.render('product', { product, categories, brands })
      })
      .catch(err => next(err))
  },
  getNewIn: (req, res, next) => {
    return Promise.all([
      Product.findAll({
        raw: true,
        nest: true,
        order: [['createdAt', 'DESC']]
      }),
      Category.findAll({ raw: true }),
      Brand.findAll({ raw: true })
    ])
      .then(([products, categories, brands]) => res.render('products', { products, categories, brands }))
      .catch(err => next(err))      
  },
  getCategoryProd: (req, res, next) => {
    return Promise.all([
      Product.findAll({
        raw: true,
        nest: true,
        order: [['createdAt', 'DESC']],
        where: {
          categoryId: req.params.categoryId
        }
      }),
      Category.findAll({ raw: true }),
      Brand.findAll({ raw: true })
    ])
      .then(([products, categories, brands]) => res.render('products', { products, categories, brands }))
      .catch(err => next(err))
  },
  getBrandProd: (req, res, next) => {
    return Promise.all([
      Product.findAll({
        raw: true,
        nest: true,
        order: [['createdAt', 'DESC']],
        where: {
          brandId: req.params.brandId
        }
      }),
      Category.findAll({ raw: true }),
      Brand.findAll({ raw: true })
    ])
      .then(([products, categories, brands]) => res.render('products', { products, categories, brands }))
      .catch(err => next(err))
  }
}

module.exports = productController
