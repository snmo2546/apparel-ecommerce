const express = require('express')
const router = express.Router()

const passport = require('../config/passport')

const userController = require('../controller/user-controller')

router.get('/signup', userController.signUpPage)
router.post('/signup', userController.signUp)
router.get('/signin', userController.signInPage)
router.post('/signin', passport.authenticate('local', { failureRedirect: '/signin', failureFlash: true }), userController.signIn)

router.get('/index', userController.getIndex)

router.use('/', (req, res) => res.redirect('/index'))

module.exports = router