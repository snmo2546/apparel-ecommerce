const { Product, Cart, CartItem, Stock } = require('../models')
const helpers = require('../helpers/auth-helpers')

const cartController = {
  getCart: (req, res, next) => {
    if (!helpers.getUser(req)) {
      if (req.session.cartId) {
        const cartId = req.session.cartId
        return Cart.findByPk(cartId, {
          nest: true,
          include: [
            { model: CartItem, include: [Product] }
          ]
        })
          .then(cart => {
            return res.render('cart', { cart: cart.toJSON() })
          })
          .catch(err => next(err))
      }
    }
    return res.render('cart')
  },
  postCart: (req, res, next) => {
    const { productId, price, quantity, size } = req.body
    let cartItems = req.session.cartItems || []

    if (!helpers.getUser(req)) {
      return Promise.all([
        // Create cart if the user doesn't have one
        Cart.findOrCreate({
          where: {
            id: req.session.cartId || 0
          }
        }),
        // Query the product's stock amount
        Stock.findOne({
          where: {
            productId,
            size
          }
        }),
        // Fetch CartItem data to check quantity
        CartItem.findOne({
          where: {
            cartId: req.session.cartId || 0,
            productId,
            size
          },
          raw: true
        })
      ])
        .then(([[cart], stock, cartItem]) => {
          // Check whether the sum of cartItemQuantity and addQuantity exceeds stock  
          const cartItemQuantity = cartItem ? cartItem.quantity : 0 
          if (stock.quantity < cartItemQuantity + Number(quantity)) throw new Error('庫存不足！')
          // Add the product is not in cartItem array 
          if (!cartItems.includes(productId)) {
            cartItems.push(productId)
          }
          // Set cartId & cartItems in session
          req.session.cartId = cart.toJSON().id
          req.session.cartItems = cartItems
          // Save information in session & findOrCreate cartItem
          return Promise.all([
            req.session.save(),
            CartItem.findOrCreate({
              where: {
                cartId: cart.id,
                productId,
                size
              },
              defaults: {
                cartId: cart.id,
                productId,
                amount: price,
                quantity: 0,
                size
              }
            })
          ])
        })
        .then(([, [cartItem]]) => {
          return cartItem.update({
            quantity: cartItem.quantity += Number(quantity),
            amount: price * cartItem.quantity
          })
        })
        .then(() => {
          req.flash('success_messages', '成功加入購物車')
          return res.redirect('back')
        })
        .catch(err => next(err))
    } else {
      const cart = helpers.getUser(req).Cart
      return Promise.all([
        CartItem.findOne({
          where: {
            cartId: cart.id,
            productId,
            size
          }
        }),
        Stock.findOne({
          where: {
            productId,
            size
          }
        })
      ])
        .then(([cartItem, stock]) => {
          // Check whether the sum of cartItemQuantity and addQuantity exceeds stock  
          const cartItemQuantity = cartItem ? cartItem.quantity : 0
          if (stock.quantity < cartItemQuantity + Number(quantity)) throw new Error('庫存不足！')
          // Create cart item data if no existing data
          return CartItem.findOrCreate({
            where: {
              cartId: cart.id,
              productId,
              size
            },
            defaults: {
              cartId: cart.id,
              productId,
              amount: price,
              quantity: 0,
              size
            }
          })
        })
        .then(([cartItem]) => {
          return cartItem.update({
            quantity: cartItem.quantity += Number(quantity),
            amount: price * cartItem.quantity
          })
        })
        .then(() => {
          req.flash('success_messages', '成功加入購物車')
          return res.redirect('back')
        })
        .catch(err => next(err))
    }
  },
  deleteCartItem: (req, res, next) => {
    if (helpers.getUser(req) && Number(req.params.userId) !== helpers.getUser(req).id) throw new Error("Can't edit others cart")
    const { cartItemId } = req.body

    return CartItem.findByPk(cartItemId)
      .then(cartItem => {
        if (!cartItem) throw new Error("Item doesn't exist in cart!")
        if (req.session.cartItems) {
          req.session.cartItems.splice(req.session.cartItems.indexOf(cartItem.productId), 1)
        }

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

    return CartItem.findByPk(id, {
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