const adminController = {
  getIndex: (req, res) => {
    return res.render('admin/index')
  },
  signInPage: (req, res) => {
    return res.render('admin/signin')
  },
  signIn: (req, res) => {
    req.flash('success_messages', '成功登入！')
    return res.redirect('/admin/index')
  }
}
module.exports = adminController
