const { Product, Cart } = require('../models')
const helpers = require('../helpers/auth-helpers')

const cartController = {
  signInPromt: (req, res) => {
    req.flash('error_messages', '請登入才能使用購物車！')
    return res.redirect('/signin')
  },
  addToCart: (req, res, next) => {
    const { userId } = req.params
    const { productId, price, quantity } = req.body

    if (userId === "0") {
      req.flash('error_messages', 'Please login to proceed!')
      return res.redirect('/signin')
    }
    return Cart.create({
      userId,
      productId,
      quantity: quantity || 1,
      amount: price
    })
    .then(() => {
      req.flash('success_messages', '成功加入購物車')
      return res.redirect('back')
    })
    .catch(err => next(err))
  }
}

module.exports = cartController