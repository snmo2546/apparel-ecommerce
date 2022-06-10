const { Order } = require('../models')

const accountController = {
  getOrders: (req, res, next) => {
    const { userId } = req.params
    return Order.findAll({
      raw: true,
      where: { userId }
    })
      .then(orders => {
        return res.render('account/order', { orders })
      })
      .catch(err => next(err))
  }
}

module.exports = accountController