const express = require('express')
const router = express.Router()

const passport = require('../config/passport')

const userController = require('../controller/user-controller')
const productController = require('../controller/product-controller')
const cartController = require('../controller/cart-controller')
const admin = require('./modules/admin')

const { generalErrorHandler } = require('../middleware/error-handler')

router.use('/admin', admin)

router.get('/signup', userController.signUpPage)
router.post('/signup', userController.signUp)
router.get('/signin', userController.signInPage)
router.post('/signin', passport.authenticate('local', { failureRedirect: '/signin', failureFlash: true }), userController.signIn)
router.get('/logout', userController.logout)

router.get('/products/categories/:categoryId', productController.getCategoryProd)
router.get('/products/brands/:brandId', productController.getBrandProd)
router.get('/products/new', productController.getNewIn)
router.get('/products/:id', productController.getProduct)

router.post('/cart/:userId', cartController.addToCart)
router.delete('/cart/:userId', cartController.deleteCartItem)
router.get('/cart', cartController.getCart)

router.get('/index', productController.getIndex)

router.use('/', (req, res) => res.redirect('/index'))
router.use('/', generalErrorHandler)

module.exports = router