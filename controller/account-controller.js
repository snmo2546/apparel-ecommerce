const { Order, OrderedProduct, Product, ShipmentMethod, ShipmentDetail, Message, User } = require('../models')
const helpers = require('../helpers/auth-helpers')

const accountController = {
  getOrders: (req, res, next) => {
    const { userId } = req.params
    if (Number(userId) !== helpers.getUser(req).id) throw new Error("Can't access other's orders!")
    return Order.findAll({
      raw: true,
      where: { userId },
      order: [['createdAt', 'DESC']]
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
        { model: Message, include: [ User ] },
        ShipmentMethod,
        ShipmentDetail
      ]
    })
      .then(order => {
        if (order.userId !== helpers.getUser(req).id) throw new Error("Can't access other's order!")
        return res.render('account/order', { order: order.toJSON() })
      })
      .catch(err => next(err))
  }
}

module.exports = accountController