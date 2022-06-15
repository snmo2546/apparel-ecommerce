const { Order, ShipmentMethod, Cart, OrderedProduct, ShipmentDetail, PaymentDetail } = require('../models')

const orderController = {
  getCartCheckout: (req, res, next) => {
    return ShipmentMethod.findAll({
      raw: true
    })
      .then(shipmentMethods => {
        return res.render('cart-checkout', { shipmentMethods })
      })
      .catch(err => next(err))
  },
  postOrder: (req, res, next) => {
    const { userId } = req.params
    const { total, recipient, phone, email, address } = req.body
    const shipmentMethodId = req.body.shipmentMethod.split('-')[0]
    return Promise.all([
      Order.create({ userId, total, shipmentMethodId }),
      Cart.findAll({ 
        where: { userId }
      }),
      ShipmentDetail.create({ recipient, phone, email, address, userId })
    ]) 
      .then(([order, cartItems, shipmentDetail]) => {
        const currentOrder = order
        const items = cartItems.map(i => ({
          quantity: i.quantity,
          amount: i.amount,
          productId: i.productId,
          orderId: order.id,
          createdAt: new Date(),
          updatedAt: new Date()
        }))
        return Promise.all([
          OrderedProduct.bulkCreate(items),
          currentOrder,
          Cart.destroy({
            where: { userId }
          }),
          order.update({ shipmentDetailId: shipmentDetail.id })
        ])
      })
      .then(([, currentOrder,]) => {
        req.flash('success_messages', '成功下單！')
        return res.render('payment', { currentOrder: currentOrder.toJSON() })
      })
      .catch(err => next(err))
  },
  postPayment: (req, res, next) => {
    const { cardNumber, cardHolder, expirationDate, securityCode, orderId } = req.body

    return Promise.all([
      PaymentDetail.create({ cardNumber, cardHolder, expirationDate, securityCode }),
      Order.findByPk(orderId)
    ])
      .then(([paymentDetail, order]) => {
        return order.update({
          paymentDetailId: paymentDetail.id
        })
      })
      .then(() => {
        req.flash('success_messages', '付款已完成！')
        return res.redirect('/index')
      })
      .catch(err => next(err))
  }
}

module.exports = orderController