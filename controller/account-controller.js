const { Order, OrderedProduct, Product, ShipmentMethod, ShipmentDetail } = require('../models')

const accountController = {
  getOrders: (req, res, next) => {
    const { userId } = req.params
    return Order.findAll({
      raw: true,
      where: { userId }
    })
      .then(orders => {
        return res.render('account/orders', { orders })
      })
      .catch(err => next(err))
  },
  getOrder: (req, res, next) => {
    const { userId, orderId } = req.params
    return Order.findByPk(orderId, {
      nest: true,
      include: [
        { model: OrderedProduct, include: [ Product ]},
        ShipmentMethod,
        ShipmentDetail
      ]
    })
      .then(order => {
        console.log(order.toJSON())
        return res.render('account/order', { order: order.toJSON() })
      })
      .catch(err => next(err))
  }
}

module.exports = accountController