const { Order, OrderedProduct, Product, ShipmentMethod, ShipmentDetail, Message, User, Brand, Category } = require('../models')
const helpers = require('../helpers/auth-helpers')

const accountController = {
  getOrders: (req, res, next) => {
    const { userId } = req.params
    if (Number(userId) !== helpers.getUser(req).id) throw new Error("Can't access other's orders!")
    return Promise.all([
      Order.findAll({
        raw: true,
        where: { userId },
        order: [['createdAt', 'DESC']]
      }),
      Brand.findAll({ raw: true }),
      Category.findAll({ raw: true })
    ])
      .then(([orders, brands, categories]) => {
        return res.render('account/orders', { orders, brands, categories })
      })
      .catch(err => next(err))
  },
  getOrder: (req, res, next) => {
    const { userId, orderId } = req.params
    return Promise.all([
      Order.findByPk(orderId, {
        nest: true,
        include: [
          { model: OrderedProduct, include: [Product] },
          { model: Message, include: [User] },
          ShipmentMethod,
          ShipmentDetail
        ]
      }),
      Brand.findAll({ raw: true }),
      Category.findAll({ raw: true })
    ])
      .then(([order, brands, categories]) => {
        if (order.userId !== helpers.getUser(req).id) throw new Error("Can't access other's order!")
        return res.render('account/order', { order: order.toJSON(), brands, categories })
      })
      .catch(err => next(err))
  }
}

module.exports = accountController