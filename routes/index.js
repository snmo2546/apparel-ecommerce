const express = require('express')
const router = express.Router()

const userController = require('../controller/user-controller')

router.get('/index', userController.getIndex)

router.use('/', (req, res) => res.redirect('/index'))

module.exports = router