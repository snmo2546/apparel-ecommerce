const express = require('express')
const router = express.Router()

const passport = require('../config/passport')

const userController = require('../controller/user-controller')
const productController = require('../controller/product-controller')
const cartController = require('../controller/cart-controller')
const orderController = require('../controller/order-controller')
const accountController = require('../controller/account-controller')
const admin = require('./modules/admin')

const { generalErrorHandler } = require('../middleware/error-handler')
const { authenticated } = require('../middleware/auth')

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

router.post('/cart/:userId', authenticated, cartController.addToCart)
router.put('/cart/:userId', authenticated, cartController.putCartItem)
router.delete('/cart/:userId', authenticated, cartController.deleteCartItem)
router.get('/cart', authenticated, cartController.getCart)

router.get('/orders/new', authenticated, orderController.getNewOrder)
router.post('/orders/payment/:userId', authenticated, orderController.postPayment)
router.post('/orders/:userId', authenticated, orderController.postNewOrder)

router.get('/accounts/:userId/orders', authenticated, accountController.getOrders)

router.get('/index', productController.getIndex)

router.use('/', (req, res) => res.redirect('/index'))
router.use('/', generalErrorHandler)

module.exports = router