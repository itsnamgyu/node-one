const express = require('express');
const router = express.Router();
const ensureLoggedIn = require('connect-ensure-login').ensureLoggedIn;

const server = require('../oauth');

const Client = require('../db/oauth_client');

// Grant authorization form
router.route('/authorize')
    .get(
        ensureLoggedIn('/user/login'),
        server.authorize((clientID, redirectURI, done) => {
            Client.getVerifiedClient(clientID, redirectURI)
                .then(client => {
                    if (client == null) {
                        done(null, false);
                    } else {
                        done(null, client, client.redirect_uri);
                    }
                })
                .catch(e => {
                    done(e);
                });
        }),
        (req, res) => {
            res.render('authorize.html', {
                transactionId: request.oauth2.transactionID,
                user: request.user,
                client: request.oauth2.client,
            });
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
        (req, res, next) => {
            console.log(req.body);
            next();
        },
        //passport.authenticate('oauth2-client-password', { session: false }),
        server.token(),
        server.errorHandler(),
    );

module.exports = router;
