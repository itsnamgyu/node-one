const uid = require('uid-safe');
const pool = require('../database').getPool();

module.exports.getClientById = (id) => {
    return pool.query('SELECT * FROM rest_one.oauth_client WHERE id=$1', [id])
        .then(q => {
            if (q.rowCount > 0) {
                return q.rows[0];
            } else {
                return null;
            }
        });
};

module.exports.createClient = (userId, clientName, redirectURI) => {
    return Promise.all(uid(20, uid(40)))
        .then(t => {
            const id = t[0];
            const secret = t[1];
            return pool.query('INSERT INTO rest_one.oauth_client VALUES (DEFAULT, $1, $2, $3, $4 RETURNING *',
                [userId, redirectURI, id, secret]);
        })
        .then(q => {
            if (q.rowCount > 0) {
                return q.rows[0];
            } else {
                throw new Error('failed to create oauth_client');
            }
        });
};

module.exports.getVerifiedClient = (id, redirectURI) => {
    module.exports.getClientById(id)
        .then(client => {
            if (client == null || client.redirect_uri !== redirectURI) {
                return false;
            } else {
                done(null, client);
            }
        })
        .catch(e => {
            done(e);
        });
};
