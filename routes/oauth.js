const express = require('express');
const router = express.Router();
const ensureLoggedIn = require('connect-ensure-login').ensureLoggedIn;
const passport = require('../passport').passport;

const server = require('../oauth');

const Client = require('../db/oauth_client');

// Grant authorization form
// E.g., Do you allow this app to access your account?
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
// E.g., post URI when you click Accept or Decline
router.route('/authorize/submit')
    .post(
        ensureLoggedIn('/user/login'),
        server.decision());

/*
    Exchange grant for token

    Request POST body will include parameters such as
        grant_type=code|password
        code=AUTHENTICATION_CODE [grant_type==code]
        username=user [grant_type==pasword]
        password=password [grant_type==password]
        redirect_uri=
        client_id=
        client_secret=

    This is according to Oauth2 specs.

    server.token() will call the appropriate handler according to grant_type
        code: oauth2orize.exchange.code
        password: oauth2orize.exchange.password

    We defined these handlers in oauth.js via server.exchange(handler)
*/
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

// Test endpoint to test bearer token authenication
router.route('/verify')
    .post(
        passport.authenticate('bearer', { session:false }),
        (req, res) => {
            res.json(req.user);
        }
    );

module.exports = router;
