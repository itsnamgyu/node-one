const oauth2orize = require('oauth2orize');
const server = oauth2orize.createServer();
const Client = require('./db/oauth_client');
const Grant= require('./db/oauth_grant');
const Token = require('./db/oauth_token');
const User = require('./db/user');

server.grant(oauth2orize.grant.code(function(client, redirectURI, user, ares, done) {
    Grant.createGrant(client.id)
        .then(grant => {
            done(null, grant.code);
        })
        .catch(e => {
            done(e);
        });
}));

server.exchange(oauth2orize.exchange.code(function(client, code, redirectURI, done) {
    Client.getVerifiedClient(client.id, redirectURI)
        .then((client) => {
            if (client == null) {
                done(null, false);
                throw null;
            } else {
                return Token.createToken(client.user_id, client.id);
            }
        })
        .then((token) => {
            done(null, token.value);
        })
        .catch(e => {
            if (e != null) {
                throw e;
            }
        });
}));

server.exchange(oauth2orize.exchange.password(function (client, email, password, scope, done) {
    Promise.resolve()
        .then(() => {
            return User.findUserByEmail(email)
        })
        .then(user => {
            if (user == null) {
                done(null, false);
                return Promise.reject(null);
            } else {
                return User.loginUser(email, password);
            }
        })
        .then(user => {
            if (user) {
                return Token.createToken(null, user.id);
            } else {
                done(null, false);
                return Promise.reject(null);
            }
        })
        .then(token => {
            if (token == null) {
                return Promise.reject('Failed to create token');
            } else {
                done(null, token.value);
            }
        })
        .catch(e => {
            if (e) {
                console.error(e);
                console.trace();
                done(e);
            }
        });
}));

server.serializeClient(function(client, done) {
    return done(null, client.id);
});

server.deserializeClient(function(id, done) {
    Client.getClientById(id)
        .then(client => {
            if (client == null) {
                done(null, false);
            } else {
                done(null, client);
            }
        });
});

module.exports = server;
