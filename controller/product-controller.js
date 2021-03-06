const { Product, Category, Brand, Stock, User } = require('../models')
const { Op } = require('sequelize')
const helpers = require('../helpers/auth-helpers')

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
      .then(([products, categories, brands]) => {
        res.render('index', { products, categories, brands })
      })
      .catch(err => next(err))
  },
  getProduct: (req, res, next) => {
    return Promise.all([
      Product.findByPk(req.params.id, {
        nest: true,
        include: [
          Category, 
          Brand, 
          Stock,
          { model: User, as: 'FavoritedUsers' }
        ]
      }),
      Category.findAll({ raw: true }),
      Brand.findAll({ raw: true })      
    ])
      .then(([product, categories, brands]) => {
        if (!product) throw new Error("Product doesn't exist!")
        const stocks = product.toJSON().Stocks.map(i => i.size)
        const userId = helpers.getUser(req) ? helpers.getUser(req).id : null
        const isFavorited = product.FavoritedUsers.some(f => f.id === userId)
        return res.render('product', { product: product.toJSON(), categories, brands, stocks, isFavorited })
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
  },
  getSearchResult: (req, res, next) => {
    const query = req.query.query
    return Promise.all([
      Product.findAll({
        raw: true,
        nest: true,
        where: { name: { [Op.like]: `%${query}%` } },
        order: [['createdAt', 'DESC']]
      }),
      Category.findAll({ raw: true }),
      Brand.findAll({ raw: true })
    ])
      .then(([products, categories, brands]) => {
        res.render('products', { products, categories, brands })
      })
      .catch(err => next(err))  }
}

module.exports = productController
