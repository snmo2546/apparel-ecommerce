const express = require('express')
const router = express.Router()

const passport = require('../../config/passport')

const adminController = require('../../controller/admin-controller')

const { authenticatedAdmin } = require('../../middleware/auth')

router.get('/signin', adminController.signInPage)
router.post('/signin', passport.authenticate('local', { failureRedirect: '/admin/signin', failureFlash: false }), adminController.signIn)

router.get('/index', authenticatedAdmin, adminController.getIndex)

router.get('/', (req, res) => res.redirect('/admin/index'))

module.exports = router