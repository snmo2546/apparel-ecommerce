const express = require('express')
const router = express.Router()

const passport = require('../../config/passport')

const adminController = require('../../controller/admin-controller')
const categoryController = require('../../controller/category-controller')

const { authenticatedAdmin } = require('../../middleware/auth')
const upload = require('../../middleware/multer')

router.get('/signin', adminController.signInPage)
router.post('/signin', passport.authenticate('local', { failureRedirect: '/admin/signin', failureFlash: false }), adminController.signIn)

router.get('/products/create', authenticatedAdmin, adminController.createProduct)
router.get('/products/:id/edit', authenticatedAdmin, adminController.editProduct)
router.get('/products/:id', authenticatedAdmin, adminController.getProduct)
router.put('/products/:id', authenticatedAdmin, upload.single('image'), adminController.putProduct)
router.delete('/products/:id', authenticatedAdmin, adminController.deleteProduct)
router.post('/products', authenticatedAdmin, upload.single('image'), adminController.postProduct)

router.get('/categories', authenticatedAdmin, categoryController.getCategories)
router.post('/categories', authenticatedAdmin, categoryController.postCategory)

router.get('/index', authenticatedAdmin, adminController.getProducts)

router.get('/', (req, res) => res.redirect('/admin/index'))

module.exports = router