const router = require('express').Router();
const passport = require('passport');

router.get("/login/success", (req, res) => {
    if (req.user) {
        res.json({
            success: true,
            massage: "OK",
            user: req.user,
            cookies: req.cookies,
        });
    } else {
        throw "Fail"
    }
});

router.get("/login/failed", (req, res) => {
    res.status(401).json({
        success: false,
        massage: "fail",
    });
});

router.get("/logout", (req, res) => {
    req.logout();
    res.redirect("http://localHost:3000")
});

router.get("/vkontakte", passport.authenticate("vkontakte"));

router.get(
    "/vkontakte/redirect",
    passport.authenticate("vkontakte", {
        successRedirect: "https://pk.hitmarker.pro",
        failureRedirect: "/auth/login/failed",
    })
);

module.exports = router;