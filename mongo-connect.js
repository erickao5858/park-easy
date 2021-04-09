/** Utilities */
const utilties = require('./utilities')

/** Read Strings */
const strings = require('./strings.json')

/** Read Config */
const configData = require('./config.json')

/** Mongoose Setup */
const mongoose = require('mongoose')
const passportLocalMongoose = require('passport-local-mongoose')
const passport = require('passport')

mongoose.connect(configData.connectionString, {
    useNewUrlParser: true, useUnifiedTopology: true
}, (err) => {
    if (err) {
        utilties.errorLog(strings.ERROR_DB_C, strings.ERROR_DB_T, err.name)
        process.exit(0)
    }
})

const Schema = mongoose.Schema
const UserDetail = new Schema({
    username: String,
    password: String
})

UserDetail.plugin(passportLocalMongoose)
const UserDetails = mongoose.model('userInfo', UserDetail, 'userInfo')

/** Passport Local Authentication */

passport.use(UserDetails.createStrategy())

passport.serializeUser(UserDetails.serializeUser())
passport.deserializeUser(UserDetails.deserializeUser())

module.exports = {
    UserDetails: UserDetails,
    db: mongoose.connection
}
