const { Order, ShipmentMethod } = require('../models')

const orderController = {
  getNewOrder: (req, res, next) => {
    return ShipmentMethod.findAll({
      raw: true
    })
      .then(shipmentMethods => {
        return res.render('new-order', { shipmentMethods })
      })
      .catch(err => next(err))
  }
}

module.exports = orderController