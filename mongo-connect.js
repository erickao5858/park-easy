/** Mongoose Setup */
const mongoose = require('mongoose')
const passportLocalMongoose = require('passport-local-mongoose')
const passport = require('passport')

mongoose.connect('mongodb+srv://erickao:WgZGk2hJkneAB1IU@cluster0.pjqwo.mongodb.net/parkEasy?retryWrites=true&w=majority', {
    useNewUrlParser: true, useUnifiedTopology: true
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

exports.UserDetails = UserDetails