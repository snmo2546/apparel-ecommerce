const nodemailer = require('nodemailer')
const fs = require('fs')
const Handlebars = require('handlebars')

const sendMailPromise = mailOptions => {
  return new Promise((resolve, reject) => {
    const transporter = nodemailer.createTransport({
      service: 'Gmail',
      auth: {
        user: process.env.GMAIL_ACCOUNT,
        pass: process.env.GMAIL_PASSWORD
      }
    })

    transporter.sendMail(mailOptions, function (error, info) {
      if (error) {
        console.log('error', error)
        resolve(false)
      } else {
        console.log('Email sent: ' + info.response)
        resolve(true)
      }
    })
  })
}

module.exports = {
  sendMail: async (receiver, mailContent) => {
    const mailOptions = {
      from: process.env.GMAIL_ACCOUNT,
      to: receiver,
      subject: mailContent.subject,
      html: mailContent.html
    }

    return await sendMailPromise(mailOptions)
  },
  orderConfirmMail: (order, shipmentDetail, paymentStatus) => {
    const source = fs.readFileSync('views/mails/orderConfirm.hbs', 'utf8')
    const template = Handlebars.compile(source)
    return {
      subject: `Thank you for your Apparel order #${order.id} `,
      html: template({ order, shipmentDetail, paymentStatus, url: process.env.URL })
    }
  },
  paymentConfirmMail: (order, paymentMethod) => {
    const source = fs.readFileSync('views/mails/paymentConfirm.hbs', 'utf8')
    const template = Handlebars.compile(source)
    return {
      subject: `Payment Confirmation for your Blanche order #${order.id} `,
      html: template({
        order,
        url: process.env.URL,
        paymentMethod
      })
    }
  }
}