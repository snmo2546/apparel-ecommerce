const { Order, ShipmentMethod, Cart, OrderedProduct, ShipmentDetail, PaymentDetail, Product } = require('../models')
const { ecpayCredit } = require('../utils/ecpay')

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
          shipmentDetail,
          Cart.destroy({
            where: { userId }
          }),
          order.update({ shipmentDetailId: shipmentDetail.id })
        ])
      })
      .then(([, currentOrder, shipmentDetail,]) => {
        req.flash('success_messages', '成功下單！')
        return res.render('order-notification', { currentOrder: currentOrder.toJSON(), shipmentDetail: shipmentDetail.toJSON() })
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
  },
  getEcpay: (req, res, next) => {
    const { userId, orderId } = req.params
    return Order.findByPk(orderId, {
      nest: true,
      include: [ 
        { model: OrderedProduct, include: [ Product ] }
      ]
    })
      .then(order => {
        if (!order) throw new Error("Order doesn't exist!")
        let items = []
        order.OrderedProducts.forEach(item => {
          const itemDetail = item.Product.name + '  x' + item.quantity.toString()
          items.push(itemDetail)
        })
        const data = {
          MerchantTradeNo: 'apparelTest' + order.id + Math.floor(Math.random() * 10000).toString(),
          MerchantTradeDate: order.createdAt,
          TotalAmount: order.total,
          ItemName: items.join('#'),
          ReturnURL: 'https://11c9-27-240-209-152.jp.ngrok.io/',
          OrderResultURL: `https://11c9-27-240-209-152.jp.ngrok.io/orders/${userId}/${orderId}/result`
        }

        return res.send(ecpayCredit(data)) 
      })
      .catch(err => next(err))
  },
  putPaymentStatus: (req, res, next) => {
    const { RtnCode } = req.body
    const { userId, orderId } = req.params

    return Order.findByPk(orderId)
      .then(order => {
        if (!order) throw new Error("Order doesn't exist!")

        return order.update({
          paymentStatus: RtnCode
        })
      })
      .then(() => res.redirect(`/accounts/${userId}/orders`))
      .catch(err => next(err))
  },
  getPayment: (req, res, next) => {
    const { userId, orderId } = req.params
    return Order.findByPk(orderId, {
      nest: true,
      include: [ShipmentDetail]
    })
      .then(order => {
        if (!order) throw new Error("Order doesn't exist!")
        console.log(order.ShipmentDetail.toJSON())
        return res.render('order-notification', { currentOrder: order.toJSON(), shipmentDetail: order.ShipmentDetail.toJSON() })
      })
      .catch(err => next(err))
  }
}

module.exports = orderController