const express = require('express')
const router = express.Router()

const passport = require('../config/passport')

const userController = require('../controller/user-controller')
const productController = require('../controller/product-controller')
const cartController = require('../controller/cart-controller')
const orderController = require('../controller/order-controller')
const accountController = require('../controller/account-controller')

const admin = require('./modules/admin')
const auth = require('./modules/auth')

const { generalErrorHandler } = require('../middleware/error-handler')
const { authenticated } = require('../middleware/auth')

router.use('/admin', admin)
router.use('/auth', auth)

router.get('/signup', userController.signUpPage)
router.post('/signup', userController.signUp)
router.get('/signin', userController.signInPage)
router.post('/signin', passport.authenticate('local', { failureRedirect: '/signin', failureFlash: true }), userController.signIn)
router.get('/logout', userController.logout)

router.get('/products/categories/:categoryId', productController.getCategoryProd)
router.get('/products/brands/:brandId', productController.getBrandProd)
router.get('/products/new', productController.getNewIn)
router.get('/products/:id', productController.getProduct)

router.get('/cart/checkout', authenticated, orderController.getCartCheckout)
router.put('/cart/:userId', cartController.putCartItem)
router.delete('/cart/:userId', cartController.deleteCartItem)
router.post('/cart/:userId', cartController.postCart)
router.get('/cart', cartController.getCart)

router.post('/orders/payment/:userId', authenticated, orderController.postPayment)
router.post('/orders/:userId/:orderId/result', authenticated, orderController.putPaymentInfo)
router.get('/orders/:userId/:orderId/payment', authenticated, orderController.getPayment)
router.get('/orders/:userId/:orderId/ecpay', authenticated, orderController.getEcpay)
router.post('/orders/:userId', authenticated, orderController.postOrder)

router.get('/accounts/:userId/orders/:orderId', authenticated, accountController.getOrder)
router.get('/accounts/:userId/orders', authenticated, accountController.getOrders)

router.get('/index', productController.getIndex)

router.use('/', (req, res) => res.redirect('/index'))
router.use('/', generalErrorHandler)

module.exports = router