const express = require('express')
const router = express.Router()

const passport = require('passport')

router.get('/facebook', passport.authenticate('facebook', {
  scope: ['email', 'public_profile']
}))

router.get('/facebook/callback', passport.authenticate('facebook', {
  successRedirect: '/index',
  failureRedirect: '/signin'
}))

router.get('/google', passport.authenticate('google', {
  scope: ['email']
}))

router.get('/google/callback', passport.authenticate('google', {
  successRedirect: '/index',
  failureRedirect: '/signin'
}))

module.exports = router