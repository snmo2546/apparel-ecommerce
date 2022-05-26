const express = require('express')
const router = express.Router()

const adminController = require('../../controller/admin-controller')

router.get('/index', adminController.getIndex)

router.get('/', (req, res) => res.redirect('/admin/index'))

module.exports = router