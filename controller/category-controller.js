const { Category } = require('../models')

const categoryController = {
  getCategories: (req, res, next) => {
    return Promise.all([
      Category.findAll({ raw: true }),
      req.params.id ? Category.findByPk(req.params.id, { raw: true }) : null
    ])
      .then(([categories, category]) => {
        res.render('admin/categories', { 
          categories,
          category
        })
      })
      .catch(err => next(err))
  },
  postCategory: (req, res, next) => {
    const { name } = req.body
    if (!name) throw new Error('Please enter category name!')

    return Category.create({ name })
      .then(() => {
        req.flash('success_messages', '成功新增分類！')
        return res.redirect('/admin/categories')
      })
      .catch(err => next(err))
  },
  putCategory: (req, res, next) => {
    const { name } = req.body
    if (!name) throw new Error('Please enter category name!')

    return Category.findByPk(req.params.id)
      .then(category => {
        if (!category) throw new Error("Category doesn't exist!")
        
        return category.update({ name })
      })
      .then(() => {
        req.flash('success_messages', '成功修改分類！')
        return res.redirect('/admin/categories')
      })
      .catch(err => next(err))
  },
  deleteCategory: (req, res, next) => {
    return Category.findByPk(req.params.id)
      .then(category => {
        if (!category) throw new Error("Category doesn't exist!")

        return category.destroy()
      })
      .then(() => {
        req.flash('success_messages', '成功刪除分類！')
        return res.redirect('/admin/categories')        
      })
      .catch(err => next(err))
  }
}

module.exports = categoryController
