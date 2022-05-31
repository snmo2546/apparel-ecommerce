const { Brand } = require('../models')

const brandController = {
  getBrands: (req, res, next) => {
    return Brand.findAll({
      raw: true
    })
      .then(brands => res.render('admin/brands', { brands }))
      .catch(err => next(err))
  }
}

module.exports = brandController
