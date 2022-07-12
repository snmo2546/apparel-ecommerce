const dayjs = require('dayjs')

module.exports = {
  ifCond: function (a, b, options) {
    return a === b ? options.fn(this) : options.inverse(this)
  },
  arrayLength: a => a ? a.length : 0,
  calculateTotal: function (a, b) {
    return a * b
  },
  calculateCartTotal: function (a) {
    let total = 0
    a.forEach(item => {
      total += item.amount
    })
    return total
  },
  displayDate: a => dayjs(a).format('YYYY-MM-DD'),
  ifContains: function (a, b, options) {
    return a.includes(b) ? options.fn(this) : options.inverse(this)
  }
}
