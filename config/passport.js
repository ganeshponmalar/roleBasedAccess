// config/passport.js
import passport from 'passport'
import GoogleStrategy from 'passport-google-oauth20'
import dotenv from 'dotenv'
import User from '../models/User.js'

dotenv.config()

passport.use(new GoogleStrategy.Strategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: process.env.GOOGLE_CALLBACK_URL
},
async (accessToken, refreshToken, profile, done) => {
    try {
        let user = await User.findOne({ googleId: profile.id })

        if (!user) {
            user = await User.create({
                username: profile.displayName,
                googleId: profile.id,
                roles: ['User'],
                active: true
            })
        }

        return done(null, user)
    } catch (err) {
        return done(err, null)
    }
}))
