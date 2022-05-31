const { Brand } = require('../models')
const { imgurFileHandler } = require('../helpers/file-helpers')

const brandController = {
  getBrands: (req, res, next) => {
    return Brand.findAll({
      raw: true
    })
      .then(brands => res.render('admin/brands', { brands }))
      .catch(err => next(err))
  },
  createBrand: (req, res) => {
    return res.render('admin/create-brand')
  },
  postBrand: (req, res, next) => {
    const { name, introduction } = req.body
    const { file } = req

    if (!name) throw new Error('Brand name is required!')

    return imgurFileHandler(file)
      .then(filePath => Brand.create({
        name,
        introduction,
        image: filePath || null
      }))
      .then(() => {
        req.flash('success_messages', '成功新增品牌！')
        return res.redirect('/admin/brands')
      })
      .catch(err => next(err))
  }
}

module.exports = brandController
