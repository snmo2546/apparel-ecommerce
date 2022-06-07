const { Product, Cart } = require('../models')
const helpers = require('../helpers/auth-helpers')

const cartController = {
  getCart: (req, res) => {
    return res.render('cart')
  },
  addToCart: (req, res, next) => {
    const { userId } = req.params
    const { productId, price, quantity } = req.body

    if (userId === '0') {
      req.flash('error_messages', 'Please login to proceed!')
      return res.redirect('/signin')
    }
    return Cart.findOne({
      where: {
        userId,
        productId
      }
    })
    .then(cartItem => {
      if (cartItem) { return cartItem.update({
        quantity: cartItem.quantity += 1
      }) }

      return Cart.create({
        userId,
        productId,
        quantity: quantity || 1,
        amount: price
      })
    })
    .then(() => {
      req.flash('success_messages', '成功加入購物車')
      return res.redirect('back')
    })
    .catch(err => next(err))
  },
  deleteCartItem: (req, res, next) => {
    if (Number(req.params.userId) !== helpers.getUser(req).id) throw new Error("Can't edit others cart")
    const { cartItemId } = req.body
    return Cart.findByPk(cartItemId)
      .then(cartItem => {
        if (!cartItem) throw new Error("Item doesn't exist in cart!")

        return cartItem.destroy()
      })
      .then(() => {
        req.flash('success_messages', '成功刪除商品！')
        return res.redirect('back')
      })
      .catch(err => next(err))
  },
  putCartItem: (req, res, next) => {
    const { id, change } = req.body

    return Cart.findByPk(id, {
      include: [Product]
    })
      .then(cartItem => {
        if (!cartItem) throw new Error("Item doesn't exist!")

        if (change === 'increase') {
          cartItem.update({
            quantity: cartItem.quantity += 1,
            amount: cartItem.quantity * cartItem.Product.price
          })
        } else if (change === 'decrease' && cartItem.quantity > 1) {
          cartItem.update({
            quantity: cartItem.quantity -= 1,
            amount: cartItem.quantity * cartItem.Product.price
          })
        }
      })
      .then(() => res.redirect('back'))
      .catch(err => next(err))
  }
}

module.exports = cartController