const { Order, ShipmentMethod, Cart, OrderedProduct } = require('../models')

const orderController = {
  getNewOrder: (req, res, next) => {
    return ShipmentMethod.findAll({
      raw: true
    })
      .then(shipmentMethods => {
        return res.render('new-order', { shipmentMethods })
      })
      .catch(err => next(err))
  },
  postNewOrder: (req, res, next) => {
    const { userId } = req.params
    const { total } = req.body
    const shipmentMethodId = req.body.shipmentMethod.split('-')[0]
    return Promise.all([
      Order.create({ userId, total, shipmentMethodId }),
      Cart.findAll({ 
        where: { userId }
      })
    ]) 
      .then(([order, cartItems]) => {
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
          })
        ])
      })
      .then(([, currentOrder,]) => {
        req.flash('success_messages', '成功下單！')
        return res.render('payment', { currentOrder: currentOrder.toJSON() })
      })
      .catch(err => next(err))
  },
  postPayment: (req, res, next) => {
    console.log(req.body)
    return res.redirect('/')
  }
}

module.exports = orderController