/** Read Strings */
const strings = require('./strings.json')

/** Express Setup */
const express = require('express')
const app = express()

app.use(express.static(__dirname))

const bodyParser = require('body-parser')
const expressSession = require('express-session')({
    // Salt
    secret: 'parkeasy',
    resave: false,
    saveUninitialized: false
})

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))
app.use(expressSession)

const port = 3000
app.listen(port, () => console.log(strings.SERVER_STARTED, port))

/** Passport Setup */
const passport = require('passport')

app.use(passport.initialize())
app.use(passport.session())

/** Mongoose Setup */
const mongoConnect = require('./mongo-connect')

/** Connect Ensure Login */
const connectEnsureLogin = require('connect-ensure-login')

/** Routes */
app.post('/login', (req, res, next) => {
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
})

app.get('/login', (req, res) => {
    res.sendFile('html/login.html', { root: __dirname })
})

app.post('/logout', (req, res) => {
    req.logout()
    res.redirect('/')
})

app.get('/',
    connectEnsureLogin.ensureLoggedIn(),
    (req, res) => res.sendFile('html/index.html', { root: __dirname })
)

app.get('/private',
    connectEnsureLogin.ensureLoggedIn(),
    (req, res) => res.sendFile('html/private.html', { root: __dirname })
)

app.get('/user',
    connectEnsureLogin.ensureLoggedIn(),
    (req, res) => res.send({ user: req.user })
)

app.get('/register', (req, res) => {
    res.sendFile('html/register.html', { root: __dirname })
})

app.post('/register', (req, res) => {
    mongoConnect.UserDetails.register({ username: req.body.username, active: false }, req.body.password, (err) => {
        if (err) {
            return res.redirect('/register?info=' + err.message)
        }
        return res.redirect('/register?info=' + 'successful')
    })
})