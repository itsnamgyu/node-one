const oauth2orize = require('oauth2orize');
const server = oauth2orize.createServer();


server.serializeClient(function(client, done) {
    return done(null, client.id);
});

server.deserializeClient(function(id, done) {
    // TODO: Find client from db and return done(null, client);
    throw new Error('Not implemented');
});

module.exports = server;
