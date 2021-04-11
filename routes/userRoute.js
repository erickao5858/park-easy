const express = require('express')
const router = express.Router()

/** Connect Ensure Login */
const connectEnsureLogin = require('connect-ensure-login')

const { login, logout, register, getUserInfo } = require('../controllers/userController')

router.post('/login', login)
router.post('/logout', logout)
router.post('/register', register)
router.get('/getUserInfo', connectEnsureLogin.ensureLoggedIn(), getUserInfo)

module.exports = router