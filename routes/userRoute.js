const express = require('express')
const router = express.Router()

// TODO: Make use of connectEnsureLogin
/** Connect Ensure Login */
const connectEnsureLogin = require('connect-ensure-login')

const { login, logout, register } = require('../controllers/userController')

router.post('/login', login)
router.get('/logout', logout)
router.post('/register', register)

module.exports = router