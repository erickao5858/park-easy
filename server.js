/** Express Setup */
const express = require('express')
const app = express()
app.use(express.static(__dirname + '/public'))

/** JSON Helper */
const bodyParser = require('body-parser')
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))

/** Express Session */
const expressSession = require('express-session')({
    secret: 'parkeasy',
    resave: false,
    saveUninitialized: false
})
app.use(expressSession)

/** Logger Setup */
const log4js = require('log4js')
const logger = log4js.getLogger('Server')
logger.level = 'debug'

// Change the port to 3000 if running locally
const port = process.env.PORT || 3000
app.listen(port, () => logger.info('Server started, listening on', port))

/** Routes */
const htmlRoute = require('./routes/htmlRoute')
app.use('/', htmlRoute)