const express = require('express')
const router = express.Router()

// Default html location
const htmlLocation = './public/html'

router.get('/', (req, res) => {
    res.sendFile('mapView.html', { root: htmlLocation })
})

router.get('/listView', (req, res) => {
    res.sendFile('listView.html', { root: htmlLocation })
})

router.get('/settings', (req, res) => {
    res.sendFile('settings.html', { root: htmlLocation })
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