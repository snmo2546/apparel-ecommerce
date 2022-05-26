const express = require('express')
const router = express.Router()

const adminController = require('../../controller/admin-controller')

const { authenticatedAdmin } = require('../../middleware/auth')

router.get('/index', authenticatedAdmin, adminController.getIndex)

router.get('/', (req, res) => res.redirect('/admin/index'))

module.exports = router