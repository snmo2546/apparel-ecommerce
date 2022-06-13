const { Product, Category, Brand, Order, User, ShipmentMethod, ShipmentDetail, OrderedProduct } = require('../models')
const { imgurFileHandler } = require('../helpers/file-helpers')

const adminController = {
  getProducts: (req, res, next) => {
    Product.findAll({
      raw: true
    })
      .then(products => res.render('admin/products', { products }))
      .catch(err => next(err))
  },
  signInPage: (req, res) => {
    return res.render('admin/signin')
  },
  signIn: (req, res) => {
    req.flash('success_messages', '成功登入！')
    return res.redirect('/admin/index')
  },
  createProduct: (req, res, next) => {
    return Promise.all([
      Category.findAll({ raw: true }),
      Brand.findAll({ raw: true })
    ])
      .then(([categories, brands]) => res.render('admin/create-product', { categories, brands }))
      .catch(err => next(err))
  },
  postProduct: (req, res, next) => {
    const { name, price, description, categoryId, brandId } = req.body
    const { file } = req

    if (!name) throw new Error('Product name is required!')
    if (!price) throw new Error('Product price is required!')

    return imgurFileHandler(file)
      .then(filePath => Product.create({
        name,
        price,
        description,
        image: filePath || null,
        categoryId,
        brandId
      }))
      .then(() => {
        req.flash('success_messages', '成功新增商品！')
        return res.redirect('/admin/index')
      })
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

        return res.render('admin/product', { product })
      })
      .catch(err => next(err))
  },
  editProduct: (req, res, next) => {
    return Promise.all([
      Product.findByPk(req.params.id, { raw: true }),
      Category.findAll({ raw: true }),
      Brand.findAll({ raw: true })
    ])
      .then(([product, categories, brands]) => {
        if (!product) throw new Error("Product doesn't exist!")

        return res.render('admin/edit-product', { product, categories, brands })
      })
      .catch(err => next(err))
  },
  putProduct: (req, res, next) => {
    const { name, price, description, categoryId, brandId } = req.body
    const { file } = req

    if (!name) throw new Error('Product name is required!')
    if (!price) throw new Error('Product price is required!')

    return Promise.all([
      Product.findByPk(req.params.id),
      imgurFileHandler(file)
    ])
      .then(([product, filePath]) => {
        if (!product) throw new Error("Product doesn't exist!")

        return product.update({
          name,
          price,
          description,
          image: filePath || product.image,
          categoryId,
          brandId
        })
      })
      .then(() => {
        req.flash('success_messages', '成功更新商品資訊')
        return res.redirect('/admin/index')
      })
      .catch(err => next(err))
  },
  deleteProduct: (req, res, next) => {
    return Product.findByPk(req.params.id)
      .then(product => {
        if (!product) throw new Error("Product doesn't exist!")
        return product.destroy()
      })
      .then(() => {
        req.flash('success_messages', '成功刪除商品！')
        return res.redirect('/admin/index')
      })
      .catch(err => next(err))
  },
  getOrders: (req, res, next) => {
    return Order.findAll({ 
      raw: true,
      nest: true,
      include: [User]
    })
      .then(orders => {
        return res.render('admin/orders', { orders })
      })
      .catch(err => next(err))
  },
  getOrder: (req, res, next) => {
    const { orderId } = req.params
    return Order.findByPk(orderId, {
      nest: true,
      include: [
        { model: OrderedProduct, include: [ Product ] },
        ShipmentMethod,
        ShipmentDetail
      ]
    })
      .then(order => {
        return res.render('admin/order', { order: order.toJSON() })
      })
      .catch(err => next(err))
  }
}
module.exports = adminController
