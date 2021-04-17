const express = require('express')
const router = express.Router()

/** Connect Ensure Login */
const connectEnsureLogin = require('connect-ensure-login')

const htmlLocation = './public'

router.get('/',
    (req, res) => res.sendFile('index.html', { root: htmlLocation })
)

router.get('/setting', (req, res) => {
    res.sendFile('setting.html', { root: htmlLocation })
})

router.get('/test', (req, res) => {
    res.sendFile('test.html', { root: htmlLocation })
})

router.get('/register', (req, res) => {
    res.sendFile('register.html', { root: htmlLocation })
})

router.get('/login', (req, res) => {
    res.sendFile('login.html', { root: htmlLocation })
})

module.exports = router