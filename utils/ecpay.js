// const crypto = require('crypto')
const ecpay_payment = require('ecpay_aio_nodejs')
const dayjs = require('dayjs')

module.exports = {
  ecpayCredit: (data) => {
    const options = {
      "OperationMode": "Test",
      "MercProfile": {
        "MerchantID": process.env.MERCHANT_ID,
        "HashKey": process.env.HASH_KEY,
        "HashIV": process.env.HASH_IV
      },
      "IgnorePayment": [
        "WebATM",
        "ATM",
        "AndroidPay"
        //    "Credit",
        //    "CVS",
        //    "BARCODE",
      ],
      "IsProjectContractor": false
    }

    let base_param = {
      MerchantTradeNo: data.MerchantTradeNo,
      MerchantTradeDate: dayjs(data.MerchantTradeDate).format('YYYY/MM/DD HH:mm:ss'),
      TotalAmount: data.TotalAmount.toString(),
      TradeDesc: 'Testing payment gateway',
      ItemName: data.ItemName,
      ReturnURL: data.ReturnURL,
      OrderResultURL: data.OrderResultURL
    }

    const create = new ecpay_payment(options)
    const htm = create.payment_client.aio_check_out_credit_onetime(parameters = base_param)
    return htm
  }
}