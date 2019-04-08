const express = require('express');
const router = express.Router();
const path = require('path');
const ensureLoggedIn = require('connect-ensure-login').ensureLoggedIn;

const User = require('../db/user');
const passport = require('../passport').passport;

const viewsDir = path.join(path.dirname(__dirname), 'views');

router.route('/')
    .get(ensureLoggedIn('/user/login'), (req, res) => {
        res.redirect('/user/me');
    });

router.route('/me')
    .get(ensureLoggedIn('/user/login'), (req, res) => {
        res.render('user/me.html', {
            user: req.user,
        });
    });

router.route('/login')
    .get((req, res) => {
        if (req.user !== undefined) {
            res.redirect('/user/me');
        } else {
            res.sendFile(path.join(viewsDir, 'login.html'));
        }
    })
    .post(passport.authenticate('local', {
            successRedirect: '/user/me',
            failureRedirect: '/user/login',
        }));

router.route('/logout')
    .get((req, res) => {
        req.logout();
        res.redirect('/user/login');
    });

router.route('/signup')
    .get((req, res) => {
        res.sendFile(path.join(viewsDir, 'signup.html'));
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
