const passport = require('passport');
const VKStrategy = require('passport-vkontakte').Strategy;
const dotenv = require('dotenv').config();
const User = require('../models/userModel');

passport.serializeUser((user, done) => {
    console.log(user)
    done(null, user._id)
});

passport.deserializeUser((id, done) => {
    User.findById(id)
        .then(user => {
            done(null, user)
        })
        .catch(err => {
            throw err
        });
});

passport.use(
    new VKStrategy(
        {
            clientID: process.env.CLIENT_ID, // VK.com docs call it 'API ID', 'app_id', 'api_id', 'client_id' or 'apiId'
            clientSecret: process.env.CLIENT_SICRET,
            callbackURL: process.env.CALL_BACK_URL,
        },
        function myVerifyCallbackFn(accessToken, refreshToken, params, profile, done) {
            console.log(accessToken, refreshToken, params, profile.id, done)
            User.findOneOrCreate({vkontakteId: profile.id})
                .then(user => {
                    console.log(user)
                    done(null, user)
                })
                .catch(done)
        }

    )
)