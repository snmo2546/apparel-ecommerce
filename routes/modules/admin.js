const express = require('express')
const router = express.Router()

const passport = require('../../config/passport')

const adminController = require('../../controller/admin-controller')
const categoryController = require('../../controller/category-controller')
const brandController = require('../../controller/brand-controller')

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

router.get('/categories/:id', authenticatedAdmin, categoryController.getCategories)
router.put('/categories/:id', authenticatedAdmin, categoryController.putCategory)
router.delete('/categories/:id', authenticatedAdmin, categoryController.deleteCategory)
router.get('/categories', authenticatedAdmin, categoryController.getCategories)
router.post('/categories', authenticatedAdmin, categoryController.postCategory)

router.get('/brands/create', authenticatedAdmin, brandController.createBrand)
router.get('/brands/:id/edit', authenticatedAdmin, brandController.editBrand)
router.put('/brands/:id', authenticatedAdmin, upload.single('image'), brandController.putBrand)
router.delete('/brands/:id', authenticatedAdmin, brandController.deleteBrand)
router.post('/brands', authenticatedAdmin, upload.single('image'), brandController.postBrand)
router.get('/brands', authenticatedAdmin, brandController.getBrands)

router.get('/orders', authenticatedAdmin, adminController.getOrders)

router.get('/index', authenticatedAdmin, adminController.getProducts)

router.get('/', (req, res) => res.redirect('/admin/index'))

module.exports = router