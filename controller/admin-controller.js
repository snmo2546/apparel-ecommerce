const { Product } = require('../models')

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
  createProduct: (req, res) => {
    return res.render('admin/create-product')
  },
  postProduct: (req, res, next) => {
    const { name, price, description, image } = req.body

    if (!name) throw new Error('Product name is required!')
    if (!price) throw new Error('Product price is required!')

    return Product.create({
      name,
      price,
      description,
      image
    })
      .then(() => {
        req.flash('success_messages', '成功新增商品！')
        return res.redirect('/admin/index')
      })
      .catch(err => next(err))
  },
  getProduct: (req, res, next) => {
    return Product.findByPk(req.params.id, {
      raw: true
    })
      .then(product => {
        if (!product) throw new Error("Product doesn't exist!")

        return res.render('admin/product', { product })
      })
      .catch(err => next(err))
  },
  editProduct: (req, res, next) => {
    return Product.findByPk(req.params.id, {
      raw: true
    })
      .then(product => {
        if (!product) throw new Error("Product doesn't exist!")

        return res.render('admin/edit-product', { product })
      })
      .catch(err => next(err))
  },
  putProduct: (req, res, next) => {
    const { name, price, description, image } = req.body

    if (!name) throw new Error('Product name is required!')
    if (!price) throw new Error('Product price is required!')

    return Product.findByPk(req.params.id)
      .then(product => {
        if (!product) throw new Error("Product doesn't exist!")

        return product.update({
          name,
          price,
          description,
          image
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
      .then(() => res.redirect('/admin/index'))
      .catch(err => next(err))
  }
}
module.exports = adminController
