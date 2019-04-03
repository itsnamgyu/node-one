const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const User = require('./user');


let initialized = false;

function init() {
    if (initialized) {
        console.log('duplicate call to passport.init()');
    } else {
        passport.use('local', new LocalStrategy({
            usernameField: 'email',
            passwordField: 'password',
        }, (email, password, done) => {
            User.loginUser(email, password)
                .then(user => {
                    done(null, user);
                })
                .catch(e => {
                    if (e instanceof User.AuthenticationError) {
                        console.log(e);
                        done(null, false, { message: 'Invalid email or password' });
                    } else {
                        done(e, false);
                    }
                });
        }));
        initialized = true;
    }
}

passport.serializeUser((user, done) => {
    done(null, user.id);
});

passport.deserializeUser((id, done) => {
    User.findUserById(id)
        .then(user => {
            console.log(user);
            done(null, user);
        })
        .catch(e => {
            done(e, null);
        });
});

passport.loginRequired = function(req, res, next) {
    if (req.user == null) {
        res.redirect('/user/login');
    } else {
        next();
    }
};

module.exports = {
    passport,
    init,
};
