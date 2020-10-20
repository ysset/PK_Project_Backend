const express = require("express")
const mongoose = require("mongoose")
const cardsRoute = require("./routes/cards.route")
const debug = require("debug")("app:server")
const VKStrategy = require("passport-vkontakte").Strategy
const passport = require("passport")
const User = require("./models/userModel")
const dotenv = require('dotenv').config()

mongoose
    .connect("mongodb+srv://Ysset:0147369852WASd@cluster0.48lsu.gcp.mongodb.net/PK_Project", {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        useFindAndModify: false
    })
    .then(() => {
        const app = express()

        app.use(require('cookie-parser')());
        app.use(require('body-parser').urlencoded({extended: true}))
        app.use(require('express-session')({secret: 'keyboard cat', resave: true, saveUninitialized: true}))
        app.use(passport.initialize())
        app.use(passport.session())

        passport.use(new VKStrategy(
            {
                clientID: process.env.clientID, // VK.com docs call it 'API ID', 'app_id', 'api_id', 'client_id' or 'apiId'
                clientSecret: process.env.clientSecret,
                callbackURL: process.env.callbackURL,
            },
            function myVerifyCallbackFn(accessToken, refreshToken, params, profile, done) {
                User.findOneOrCreate({vkontakteId: profile.id})
                    .then(user => done(null, user))
                    .catch(done)
            }
        ));

        passport.serializeUser((user, done) => {
            done(null, user.id)
        })

        passport.deserializeUser(function (id, done) {
            User.findById(id)
                .then(function (user) {
                    done(null, user);
                })
                .catch(done);
        });

        app.get('/auth/vkontakte', passport.authenticate('vkontakte'));

        app.get('/auth/vkontakte/callback',
            passport.authenticate('vkontakte', {
                successRedirect: 'https://pk.hitmarker.pro/',
                failureRedirect: '/login'
            })
        );

        app.use('/', cardsRoute)

        app.listen(5000, () => debug(console.log("Server is running")))
    })

