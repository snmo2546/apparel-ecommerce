const { Order, ShipmentMethod, Cart, OrderedProduct, ShipmentDetail, PaymentDetail, Product, CartItem, Stock } = require('../models')
const { ecpayCredit } = require('../utils/ecpay')
const { sendMail, orderConfirmMail, paymentConfirmMail } = require('../utils/mail')
const storage = require('sessionstorage')

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
      Cart.findOne({ 
        where: { userId },
        include: [CartItem]
      }),
      ShipmentDetail.create({ recipient, phone, email, address, userId })
    ]) 
      .then(([order, cart, shipmentDetail]) => {
        const currentOrder = order
        // Put cart items in an array in order to create ordered items
        const items = cart.CartItems.map(i => ({
          quantity: i.quantity,
          amount: i.amount,
          productId: i.productId,
          orderId: order.id,
          color: i.color,
          size: i.size,
          createdAt: new Date(),
          updatedAt: new Date()
        }))
        return Promise.all([
          // Pass order & shipment detail info to produce mail content
          currentOrder,
          shipmentDetail,
          OrderedProduct.bulkCreate(items),
          order.update({ shipmentDetailId: shipmentDetail.id }),
          // Remove ordered items from cart & deduct the amount from stock
          CartItem.destroy({
            where: { cartId: cart.id }
          }),
          cart.CartItems.map(i => {
            return Stock.findOne({
              where: {
                productId: i.productId,
                size: i.size
              }
            })
              .then(stock => {
                return stock.update({
                  quantity: stock.quantity - i.quantity
                })
              })
              .catch(err => next(err))
          })
        ])
      })
      .then(([currentOrder, shipmentDetail,]) => {
        const mailContent = orderConfirmMail(currentOrder.toJSON(), shipmentDetail.toJSON(), 'unpaid', req)        
        req.flash('success_messages', '成功下單！')
        return Promise.all([
          sendMail(req.user.email, mailContent),
          res.render('payment', { currentOrder: currentOrder.toJSON(), shipmentDetail: shipmentDetail.toJSON() })
        ])
      })
      .catch(err => next(err))
  },
  getEcpay: (req, res, next) => {
    const { userId, orderId } = req.params
    storage.setItem('session', req.session)
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
          ReturnURL: process.env.WEBSITE_URL,
          OrderResultURL: process.env.WEBSITE_URL + `/orders/${userId}/${orderId}/result`
        }

        return res.send(ecpayCredit(data)) 
      })
      .catch(err => next(err))
  },
  getPayment: (req, res, next) => {
    const { orderId } = req.params
    return Order.findByPk(orderId, {
      nest: true,
      include: [ShipmentDetail]
    })
      .then(order => {
        if (!order) throw new Error("Order doesn't exist!")

        return res.render('payment', { currentOrder: order.toJSON(), shipmentDetail: order.ShipmentDetail.toJSON() })
      })
      .catch(err => next(err))
  },
  putPaymentInfo: (req, res, next) => {
    const { RtnCode, PaymentDate, PaymentType, PaymentTypeChargeFee, TradeAmt } = req.body
    const { userId, orderId } = req.params
    req.session.passport = storage.getItem('session').passport
    req.session.save()
    return Promise.all([
      Order.findByPk(orderId, {
        include: [ShipmentDetail]
      }),
      PaymentDetail.create({
        paymentDate: PaymentDate,
        paymentType: PaymentType,
        paymentTypeChargeFee: PaymentTypeChargeFee,
        tradeAmt: TradeAmt
      })
    ])
      .then(([order, paymentDetail]) => {
        if (!order) throw new Error("Order doesn't exist!")
        const mailContent = paymentConfirmMail(order.toJSON(), paymentDetail.toJSON())
        return Promise.all([
          mailContent,
          order.update({
            paymentStatus: RtnCode,
            paymentDetailId: paymentDetail.id
          })
        ]) 
      })
      .then(([mailContent,]) => {
        res.redirect(`/accounts/${userId}/orders`)
        return mailContent
      })
      .then(mailContent => {
        return sendMail(req.user.email, mailContent)
      })
      .catch(err => next(err))
  }
}

module.exports = orderController