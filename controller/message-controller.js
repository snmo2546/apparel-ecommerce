const { Message, User, Order } = require('../models')
const helpers = require('../helpers/auth-helpers')

const messageController = {
  postMessage: (req, res, next) => {
    const { orderId, text } = req.body
    const userId = helpers.getUser(req).id

    if (!text) throw new Error('請輸入訊息內容！')

    return Promise.all([
      User.findByPk(userId),
      Order.findByPk(orderId)
    ])
      .then(([user, order]) => {
        if (!user) throw new Error('帳戶不存在！')
        if (!order) throw new Error('訂單資料不存在！')
        return Message.create({
          text,
          orderId,
          userId
        })
      })
      .then(() => {
        return res.redirect('back')
      })
      .catch(err => next(err))
  }
}

module.exports = messageController
