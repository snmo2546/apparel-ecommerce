const express = require('express')
const router = express.Router()

const passport = require('../../config/passport')

const adminController = require('../../controller/admin-controller')

const { authenticatedAdmin } = require('../../middleware/auth')

router.get('/signin', adminController.signInPage)
router.post('/signin', passport.authenticate('local', { failureRedirect: '/admin/signin', failureFlash: false }), adminController.signIn)

router.get('/products/create', authenticatedAdmin, adminController.createProduct)
router.get('/products/:id/edit', authenticatedAdmin, adminController.editProduct)
router.get('/products/:id', authenticatedAdmin, adminController.getProduct)
router.put('/products/:id', authenticatedAdmin, adminController.putProduct)
router.post('/products', authenticatedAdmin, adminController.postProduct)

router.get('/index', authenticatedAdmin, adminController.getProducts)

router.get('/', (req, res) => res.redirect('/admin/index'))

module.exports = router