/** Read Strings */
const strings = require('./strings.json')

/** Mongoose Setup */
const mongoose = require('mongoose')
const passportLocalMongoose = require('passport-local-mongoose')
const passport = require('passport')

mongoose.connect('mongodb+srv://erickao:U08uDNf0bolf0eIL@cluster0.pjqwo.mongodb.net/parkEasy?retryWrites=true&w=majority', {
    useNewUrlParser: true, useUnifiedTopology: true
}, (err) => {
    if (err) {
        console.log(strings.ERROR_DB_CONNECTION)
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
