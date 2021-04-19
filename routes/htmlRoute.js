const express = require('express')
const router = express.Router()

/** Connect Ensure Login */
const connectEnsureLogin = require('connect-ensure-login')

const htmlLocation = './public'

router.get('/', (req, res) => {
    res.sendFile('mapView.html', { root: htmlLocation })
})

router.get('/listView', (req, res) => {
    res.sendFile('listView.html', { root: htmlLocation })
})

router.get('/settings', connectEnsureLogin.ensureLoggedIn(), (req, res) => {
    res.sendFile('settings.html', { root: htmlLocation })
})

router.get('/test', (req, res) => {
    res.sendFile('test.html', { root: htmlLocation })
})

router.get('/register', connectEnsureLogin.ensureLoggedOut(), (req, res) => {
    res.sendFile('register.html', { root: htmlLocation })
})

router.get('/login', (req, res) => {
    res.sendFile('login.html', { root: htmlLocation })
})

module.exports = router