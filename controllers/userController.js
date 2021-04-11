const passport = require('passport')
const User = require('../models/user')

exports.login = (req, res, next) => {
    passport.authenticate('local', (err, user, info) => {
        if (err) {
            return next(err)
        }
        if (!user) {
            return res.redirect('/login?info=' + info)
        }
        req.logIn(user, (err) => {
            if (err) {
                return next(err)
            }
            return res.redirect('/')
        })
    })(req, res, next)
}

exports.logout = (req, res) => {
    req.logout()
    res.redirect('/')
}

exports.register = (req, res) => {
    User.register({ username: req.body.username, active: false }, req.body.password, (err) => {
        if (err) {
            return res.redirect('/register?info=' + err.message)
        }
        return res.redirect('/register?info=' + 'successful')
    })
}

exports.getUserInfo = (req, res) => {
    res.send({ user: req.user })
}