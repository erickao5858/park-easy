const express = require('express')
const router = express.Router()

/** Connect Ensure Login */
const connectEnsureLogin = require('connect-ensure-login')

const htmlLocation = './public'

router.get('/',
    connectEnsureLogin.ensureLoggedIn(),
    (req, res) => res.sendFile('index.html', { root: htmlLocation })
)

router.get('/register', (req, res) => {
    res.sendFile('register.html', { root: htmlLocation })
})

router.get('/login', (req, res) => {
    res.sendFile('login.html', { root: htmlLocation })
})

router.get('/private',
    connectEnsureLogin.ensureLoggedIn(),
    (req, res) => res.sendFile('private.html', { root: htmlLocation })
)

module.exports = router