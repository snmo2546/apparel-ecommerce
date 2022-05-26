const express = require('express')
const router = express.Router()

const passport = require('../config/passport')

const userController = require('../controller/user-controller')
const admin = require('./modules/admin')

router.use('/admin', admin)

router.get('/signup', userController.signUpPage)
router.post('/signup', userController.signUp)
router.get('/signin', userController.signInPage)
router.post('/signin', passport.authenticate('local', { failureRedirect: '/signin', failureFlash: true }), userController.signIn)
router.get('/logout', userController.logout)

router.get('/index', userController.getIndex)

router.use('/', (req, res) => res.redirect('/index'))

module.exports = router