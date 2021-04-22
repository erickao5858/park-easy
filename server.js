/** Express Setup */
const express = require('express')
const app = express()

app.use(express.static(__dirname + '/public'))

const bodyParser = require('body-parser')
const expressSession = require('express-session')({
    secret: 'parkeasy',
    resave: false,
    saveUninitialized: false
})

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))
app.use(expressSession)

const port = process.env.PORT || 3000
app.listen(port, () => console.log('Server started, listening on', port))

/** Routes */
const htmlRoute = require('./routes/htmlRoute')
app.use('/', htmlRoute)