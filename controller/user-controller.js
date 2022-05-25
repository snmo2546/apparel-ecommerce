const bcrypt = require('bcryptjs')
const db = require('../models')
const { User } = db

const userController = {
  getIndex: (req, res) => {
    return res.render('index')
  },
  signUpPage: (req, res) => {
    return res.render('signup')
  },
  signUp: (req, res, next) => {
    const { name, email, password, passwordCheck } = req.body
    if (passwordCheck && password !== passwordCheck) throw new Error('Passwords do not match')

    return User.findOne({ where: { email } })
      .then(registeredEmail => {
        if (registeredEmail) throw new Error('Email already been used!')

        return bcrypt.hash(password, 10)
      })
      .then(hash => User.create({
        name,
        email,
        password: hash
      }))
      .then(() => {
        return res.redirect('/')
      })
      .catch(err => next(err))
  },
  signInPage: (req, res) => {
    return res.render('signin')
  },
  signIn: (req, res) => {
    return res.redirect('/index')
  }
}
module.exports = userController
