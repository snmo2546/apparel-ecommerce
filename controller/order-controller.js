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
    const shipmentMethodId = req.body.shipmentMethod.split('-')[0]
    return Promise.all([
      Order.create({ userId, shipmentMethodId }),
      Cart.findAll({ 
        where: { userId }
      })
    ]) 
      .then(([order, cartItems]) => {
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
          Cart.destroy({
            where: { userId }
          })
        ])
      })
      .then(() => {
        req.flash('success_messages', '成功下單！')
        return res.redirect('/index')
      })
      .catch(err => next(err))
  }
}

module.exports = orderController