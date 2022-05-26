const { ensureAuthenticated, getUser } = require('../helpers/auth-helpers')

const authenticated = (req, res, next) => {
  if (ensureAuthenticated(req)) {
    return next()
  }
  res.redirect('/signin')
}

const authenticatedAdmin = (req, res, next) => {
  if (ensureAuthenticated(req)) {
    if (getUser(req).role === 'admin') return next()
    res.redirect('/')
  } else {
    res.redirect('/admin/signin')
  }
}

module.exports = {
  authenticated,
  authenticatedAdmin
}