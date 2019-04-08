const express = require('express');
const router = express.Router();

const User = require('../db/user');
const passport = require('../passport').passport;

router.route('/')
    .get((req, res) => {
        User.getAllUsers()
            .then(users => {
                res.render('user/index.html', {
                    user: req.user,
                    users: users,
                });
            });
    });

router.route('/login')
    .get((req, res) => {
        if (req.user !== undefined) {
            res.redirect('/user');
        } else {
            res.render('user/login.html');
        }
    })
    .post(passport.authenticate('local', {
            successRedirect: '/user',
            failureRedirect: '/user/login',
        }));

router.route('/logout')
    .get((req, res) => {
        req.logout();
        res.redirect('/user/login');
    });

router.route('/signup')
    .get((req, res) => {
        res.render('user/signup.html');
    })
    .post((req, res) => {
        const body = req.body;
        User.createUser(body.email, body.password, body.name)
            .then((user) => {
                req.login(user, function(e) {
                    if (e) {
                        res.redirect('/user/signup');
                        throw e;
                    }
                    return res.redirect('/user');
                });
            })
            .catch(e => {
                console.log(e);
                res.redirect('/user/signup');
            });
    });

router.route('/auth/github')
    .get(passport.authenticate('github'));

router.route('/auth/github/callback')
    .get(passport.authenticate('github', {
    successRedirect: '/user',
    failureRedicret: '/user/login',
}));

module.exports = router;
