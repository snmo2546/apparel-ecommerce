const bcrypt = require('bcryptjs')
const db = require('../models')
const helpers = require('../helpers/auth-helpers')
const { User, Cart, Favorite, Product } = db

const userController = {
  signUpPage: (req, res) => {
    return res.render('signup')
  },
  signUp: (req, res, next) => {
    const { name, email, password, passwordCheck } = req.body
    if (passwordCheck && password !== passwordCheck) throw new Error('Passwords do not match')

    return User.findOne({ where: { email } })
      .then(registeredEmail => {
        if (registeredEmail) throw new Error('Email has already been used!')

        return bcrypt.hash(password, 10)
      })
      .then(hash => User.create({
        name,
        email,
        password: hash
      }))
      .then(user => {
        Cart.create({
          userId: user.id
        })
      })
      .then(() => {
        req.flash('success_messages', '成功註冊帳號！')
        return res.redirect('/')
      })
      .catch(err => next(err))
  },
  signInPage: (req, res) => {
    return res.render('signin')
  },
  signIn: (req, res) => {
    req.flash('success_messages', '成功登入！')
    return res.redirect('/index')
  },
  logout: (req, res, next) => {
    req.logout(err => {
      if (err) { return next(err) }
      req.flash('success_messages', '成功登出！')
      return res.redirect('back')
    })
  },
  addFavorite: (req, res, next) => {
    const { productId } = req.params
    return Promise.all([
      Product.findByPk(productId),
      Favorite.findOne({
        where: {
          userId: helpers.getUser(req).id,
          productId
        }
      })
    ])
      .then(([product, favorite]) => {
        if (!product) throw new Error('商品不存在！')
        if (favorite) throw new Error('已將商品加入最愛！')

        return Favorite.create({
          userId: helpers.getUser(req).id,
          productId
        })
      })
      .then(() => res.redirect('back'))
      .catch(err => next(err))
  },
  removeFavorite: (req, res, next) => {
    const { productId } = req.params
    return Favorite.findOne({
      where: {
        userId: helpers.getUser(req).id,
        productId
      }
    })
      .then(favorite => {
        if (!favorite) throw new Error('尚未把商品加入最愛！')

        return favorite.destroy()
      })
      .then(() => res.redirect('back'))
      .catch(err => next(err))
  }
}
module.exports = userController
