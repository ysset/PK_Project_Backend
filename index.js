const express = require("express");
const mongoose = require("mongoose");
const cardsRoute = require("./routes/cards.route");
const authRoute = require("./routes/authRoutes");
const debug = require("debug")("app:server");
const passport = require("passport");
const VKStrategySetup = require('./passportSetups/vkontakteSetup');
const session = require('express-session');
const dotenv = require('dotenv').config();
const cors = require("cors");
const cookieSession = require("cookie-session");
const cookieParser = require('cookie-parser');


mongoose
    .connect(process.env.MONGODB, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        useFindAndModify: false
    })
    .then(() => {
        const app = express()
        const authCheck = (req, res, next) => {
            if (!req.user) {
                res.status(401).json({
                    authenticated: false,
                    message: "user has not been authenticated"
                });
            } else {
                next();
            }
        };

        app.use(
            cookieSession({
                name: "session",
                keys: [process.env.COOKIE_KEY],
                maxAge: 24 * 60 * 60 * 100
            })
        );
        app.use(cookieParser());
        app.use(passport.initialize());
        app.use(passport.session());

        app.use(passport.initialize())
        app.use(
            cors({
                origin: "*",
                methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
                credentials: true,
            })
        );
        app.use('/', cardsRoute)
        app.use('/auth', authRoute)

        app.get("/", authCheck, (req, res) => {
            res.status(200)
        })

        app.listen(5000, () => debug(console.log("Server is running")))
    })

