const express = require('express');
const router = express.Router();
const ensureLoggedIn = require('connect-ensure-login').ensureLoggedIn;

const server = require('../oauth');
const passport = require('../passport').passport;

// Grant authorization form
router.route('/authorize')
    .get(
        ensureLoggedIn('/user/login'),
        server.authorize((clientID, redirectURI, done) => {
            // TODO: match registered clientID to redirectURI
            throw new Error('not implemented');
        }),
        (req, res) => {
            // TODO: return authorization selection page for user
            throw new Error('not implemented');
        }
    );

// Post endpoint for grant authorization submission
router.route('/authorize/submit')
    .post(
        ensureLoggedIn('/user/login'),
        server.decision());

// Exchange grant for token
router.route('/token')
    .post(
        passport.authenticate('oauth2-client-password', { session: false }),
        server.token(),
        server.errorHandler(),
    );

module.exports = router;
