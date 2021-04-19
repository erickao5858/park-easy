const passport = require('passport')
const User = require('../models/user')

exports.login = (req, res, next) => {
    passport.authenticate('local', (err, user, info) => {
        if (err) {
            return next(err)
        }
        if (!user) {
            return res.json({})
        }

        req.logIn(user, (err) => {
            if (err) {
                return next(err)
            }
            User.find().select('_id username').exec((err, records) => {
                return res.json(records)
            })
        })
    })(req, res, next)
}

exports.logout = (req, res) => {
    req.logout()
    return res.json({ success: true })
}

exports.register = (req, res) => {
    User.register({ username: req.body.username, active: false }, req.body.password, (err) => {
        if (err) {
            return res.json({ success: false })
        }
        return res.json({ success: true })
    })
}