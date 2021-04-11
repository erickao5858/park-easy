const passport = require('passport')

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